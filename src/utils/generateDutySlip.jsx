import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ===== LOAD IMAGE FROM URL ===== */
async function loadImageAsBase64(imageUrl) {
  try {
    if (!imageUrl) {
      console.warn("Image URL missing");
      return null;
    }

    const response = await fetch(imageUrl);

    if (!response.ok) {
      console.warn("Image fetch failed:", response.status);
      return null;
    }

    const blob = await response.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error("Error loading image:", err);
    return null;
  }
}

/* ===== GENERATE DUTY SLIP ===== */
export async function generateDutySlip(
  dutySlip,
  trip,
  garageData
) {
  const doc = new jsPDF("p", "mm", "a4");

  /* ================= TITLE ================= */

  doc.setFontSize(18);
  doc.setTextColor(80, 0, 120);
  doc.text("OFFICIAL DUTY SLIP", 105, 15, {
    align: "center",
  });

  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);

  /* ================= TOTAL KM ================= */

  const totalKm =
    trip.startKm && trip.endKm
      ? (trip.endKm - trip.startKm).toFixed(2)
      : 0;

  /* ================= TRIP DETAILS ================= */

  autoTable(doc, {
    startY: 25,
    theme: "grid",
    styles: {
      fontSize: 9,
    },
    body: [
      [
        "Trip ID",
        trip.tripId || "-",
        "Vehicle",
        trip.vehicleType || "-",
      ],

      [
        "Start Location",
        trip.startLocation ||
          trip.pickupLocation ||
          "-",
        "Start KM",
        trip.startKm || "-",
      ],

      [
        "End Location",
        trip.endLocation ||
          trip.dropLocation ||
          "-",
        "End KM",
        trip.endKm || "-",
      ],

      [
        "Total Distance",
        `${totalKm} KM`,
        "Total Amount",
        `₹ ${trip.totalAmount || 0}`,
      ],

      [
        "Driver Name",
        trip.driverName || "-",
        "Driver Phone",
        trip.driverPhone || "-",
      ],

      [
        "User Name",
        trip.userName || "-",
        "User Phone",
        trip.userPhone || "-",
      ],

      [
        "Vehicle No",
        trip.driverCarNumber || "-",
        "Vehicle Type",
        trip.driverCarType || "-",
      ],

      [
        "Trip Status",
        trip.status
          ? trip.status.replace("_", " ")
          : "-",
        "",
        "",
      ],
    ],
  });

  /* ================= GARAGE MOVEMENT ================= */

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 8,
    theme: "grid",
    head: [["Garage Type", "KM", "Time"]],
    body: garageData.map((g) => [
      g.type,
      g.km || "-",
      g.time || "-",
    ]),
  });

  /* ================= MAP SECTION ================= */

  const origin =
    trip.pickupLocation ||
    trip.startLocation ||
    "";

  const destination =
    trip.dropLocation ||
    trip.endLocation ||
    "";

  const mapUrl =
    origin && destination
      ? `https://maps.googleapis.com/maps/api/staticmap?size=600x300&markers=color:green|${encodeURIComponent(
          origin
        )}&markers=color:red|${encodeURIComponent(
          destination
        )}&path=color:0x0000ff|weight:5|${encodeURIComponent(
          origin
        )}|${encodeURIComponent(destination)}`
      : null;

  if (mapUrl) {
    try {
      doc.setFontSize(12);
      doc.text(
        "Trip Route Map",
        14,
        doc.lastAutoTable.finalY + 12
      );

      const mapImage =
        await loadImageAsBase64(mapUrl);

      if (mapImage) {
        doc.addImage(
          mapImage,
          "PNG",
          14,
          doc.lastAutoTable.finalY + 16,
          180,
          60
        );
      } else {
        doc.text(
          "Map preview unavailable",
          14,
          doc.lastAutoTable.finalY + 25
        );
      }
    } catch (err) {
      console.error("Map image failed:", err);
    }
  }

  /* ================= ODOMETER IMAGES ================= */

  let imageSectionY = mapUrl
    ? doc.lastAutoTable.finalY + 85
    : doc.lastAutoTable.finalY + 18;

  doc.setFontSize(12);
  doc.text("Odometer Proof", 14, imageSectionY);

  const startOdo =
    await loadImageAsBase64(
      trip.odometerImageUrl
    );

  const endOdo =
    await loadImageAsBase64(
      trip.endOdometerImageUrl
    );

  if (startOdo) {
    doc.text(
      "Start Odometer",
      14,
      imageSectionY + 8
    );

    doc.addImage(
      startOdo,
      "JPEG",
      14,
      imageSectionY + 12,
      80,
      50
    );
  }

  if (endOdo) {
    doc.text(
      "End Odometer",
      110,
      imageSectionY + 8
    );

    doc.addImage(
      endOdo,
      "JPEG",
      110,
      imageSectionY + 12,
      80,
      50
    );
  }

  /* ================= CUSTOMER SIGNATURE ================= */

  const signatureY = imageSectionY + 75;

  doc.setFontSize(12);
  doc.text("Customer Signature", 14, signatureY);

  doc.setFontSize(9);

  doc.text(
    `Customer Name: ${
      trip.userName || "-"
    }`,
    14,
    signatureY + 8
  );

  doc.text(
    `Customer Phone: ${
      trip.userPhone || "-"
    }`,
    14,
    signatureY + 14
  );

  const signatureImage =
    await loadImageAsBase64(
      trip.signatureUrl
    );

  if (signatureImage) {
    doc.addImage(
      signatureImage,
      "PNG",
      14,
      signatureY + 18,
      60,
      25
    );
  } else {
    doc.text(
      "Signature not available",
      14,
      signatureY + 28
    );
  }

  /* ================= DRIVER EXPENSES ================= */

  const expensesStartY = signatureY + 55;

  if (trip.expenses && trip.expenses.length > 0) {
    autoTable(doc, {
      startY: expensesStartY,
      theme: "grid",
      head: [["Type", "Description", "Amount"]],
      body: trip.expenses.map((e) => [
        e.type || "-",
        e.description || "-",
        `₹ ${e.amount || 0}`,
      ]),
    });
  }

  /* ================= FOOTER ================= */

  const finalY =
    doc.lastAutoTable?.finalY ||
    expensesStartY + 10;

  doc.setFontSize(10);

  doc.text(
    "Generated by Arcot Cabs Management System",
    105,
    finalY + 15,
    {
      align: "center",
    }
  );

  /* ================= SAVE PDF ================= */

  doc.save(`DutySlip-${trip.tripId}.pdf`);
}
