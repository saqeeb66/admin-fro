import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ================= LOAD IMAGE ================= */

async function loadImageAsBase64(url) {
  try {
    if (!url) return null;

    const response = await fetch(url, {
      mode: "cors",
      cache: "no-cache",
    });

    if (!response.ok) {
      console.error(
        "Image fetch failed:",
        response.status
      );
      return null;
    }

    const blob = await response.blob();

    return await new Promise((resolve) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error(
      "Error loading image:",
      err
    );
    return null;
  }
}

/* ================= GENERATE PDF ================= */

export async function generateDutySlip(
  dutySlip,
  trip,
  garageData
) {
  try {
    const doc = new jsPDF("p", "mm", "a4");

    /* ================= TITLE ================= */

    doc.setFont("helvetica", "bold");

    doc.setFontSize(18);

    doc.text(
      "OFFICIAL DUTY SLIP",
      105,
      15,
      {
        align: "center",
      }
    );

    doc.setFont("helvetica", "normal");

    doc.setFontSize(9);

    /* ================= TOTAL DISTANCE ================= */

    const totalKm =
      trip.startKm && trip.endKm
        ? (
            trip.endKm - trip.startKm
          ).toFixed(2)
        : 0;

    /* ================= MAIN DETAILS TABLE ================= */

    autoTable(doc, {
      startY: 25,
      theme: "grid",

      styles: {
        fontSize: 9,
        cellPadding: 3,
      },

      headStyles: {
        fillColor: [0, 150, 136],
        textColor: 255,
        fontStyle: "bold",
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
          "Driver",
          trip.driverName || "-",

          "Phone",
          trip.driverPhone || "-",
        ],

        [
          "Passenger",
          trip.userName || "-",

          "Phone",
          trip.userPhone || "-",
        ],

        [
          "Vehicle No",
          trip.driverCarNumber || "-",

          "Distance",
          `${totalKm} KM`,
        ],

        [
          "Amount",
          `₹ ${trip.totalAmount || 0}`,

          "Status",
          trip.status?.replace(
            "_",
            " "
          ) || "-",
        ],
      ],
    });

    /* ================= ROUTE MAP ================= */

    let nextY =
      doc.lastAutoTable.finalY + 10;

    try {
      const origin =
        trip.pickupLocation ||
        trip.startLocation ||
        "";

      const destination =
        trip.dropLocation ||
        trip.endLocation ||
        "";

      if (origin && destination) {
        doc.setFontSize(12);

        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.text(
          "Route Map (Pickup → Drop)",
          14,
          nextY
        );

        doc.setFont(
          "helvetica",
          "normal"
        );

        /* ===== GOOGLE STATIC MAP ===== */

        const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=1000x500&maptype=roadmap&markers=color:green|label:S|${encodeURIComponent(
          origin
        )}&markers=color:red|label:E|${encodeURIComponent(
          destination
        )}&path=color:0x0000ff|weight:5|${encodeURIComponent(
          origin
        )}|${encodeURIComponent(
          destination
        )}&key=YOUR_GOOGLE_MAPS_API_KEY`;

        const mapImage =
          await loadImageAsBase64(
            staticMapUrl
          );

        if (mapImage) {
          doc.addImage(
            mapImage,
            "PNG",
            14,
            nextY + 5,
            180,
            75
          );

          nextY += 90;
        } else {
          doc.setTextColor(
            255,
            0,
            0
          );

          doc.text(
            "Map unavailable",
            14,
            nextY + 10
          );

          doc.setTextColor(
            0,
            0,
            0
          );

          nextY += 20;
        }
      }
    } catch (err) {
      console.error(
        "Map generation failed:",
        err
      );

      nextY += 20;
    }

    /* ================= GARAGE TABLE ================= */

    autoTable(doc, {
      startY: nextY,

      theme: "grid",

      styles: {
        fontSize: 9,
        cellPadding: 3,
      },

      headStyles: {
        fillColor: [0, 150, 136],
        textColor: 255,
        fontStyle: "bold",
      },

      head: [
        [
          "Garage Type",
          "KM",
          "Time",
        ],
      ],

      body: garageData.map((g) => [
        g.type,
        g.km || "-",
        g.time || "-",
      ]),
    });

    /* ================= SIGNATURE SECTION ================= */

    const signY =
      doc.lastAutoTable.finalY + 15;

    doc.setFontSize(12);

    doc.setFont("helvetica", "bold");

    doc.text(
      "Customer Signature",
      14,
      signY
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(9);

    doc.text(
      `Customer Name: ${
        trip.userName || "-"
      }`,
      14,
      signY + 8
    );

    doc.text(
      `Customer Phone: ${
        trip.userPhone || "-"
      }`,
      14,
      signY + 14
    );

    /* ================= SIGNATURE IMAGE ================= */

    try {
      const signature =
        await loadImageAsBase64(
          trip.signatureUrl
        );

      if (signature) {
        doc.addImage(
          signature,
          "PNG",
          14,
          signY + 18,
          60,
          30
        );
      } else {
        doc.setTextColor(
          255,
          0,
          0
        );

        doc.text(
          "Signature unavailable",
          14,
          signY + 28
        );

        doc.setTextColor(
          0,
          0,
          0
        );
      }
    } catch (err) {
      console.error(
        "Signature failed:",
        err
      );
    }

    /* ================= EXPENSES ================= */

    if (
      trip.expenses &&
      trip.expenses.length > 0
    ) {
      autoTable(doc, {
        startY: signY + 55,

        theme: "grid",

        styles: {
          fontSize: 9,
          cellPadding: 3,
        },

        headStyles: {
          fillColor: [0, 150, 136],
          textColor: 255,
          fontStyle: "bold",
        },

        head: [
          [
            "Type",
            "Description",
            "Amount",
          ],
        ],

        body: trip.expenses.map(
          (expense) => [
            expense.type || "-",

            expense.description ||
              "-",

            `₹ ${
              expense.amount || 0
            }`,
          ]
        ),
      });
    }

    /* ================= FOOTER ================= */

    doc.setFontSize(10);

    doc.setTextColor(120);

    doc.text(
      "Generated by Arcot Cabs",
      105,
      285,
      {
        align: "center",
      }
    );

    /* ================= SAVE ================= */

    doc.save(
      `DutySlip-${trip.tripId}.pdf`
    );
  } catch (err) {
    console.error(
      "PDF Generation Failed:",
      err
    );
  }
}
