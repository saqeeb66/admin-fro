import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

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

/* ================= PDF ================= */

export async function generateDutySlip(
  dutySlip,
  trip,
  garageData
) {
  try {
    const doc = new jsPDF("p", "mm", "a4");

    /* ================= TITLE ================= */

    doc.setFontSize(17);

    doc.text(
      "OFFICIAL DUTY SLIP",
      105,
      15,
      {
        align: "center",
      }
    );

    doc.setFontSize(9);

    /* ================= TOTAL KM ================= */

    const totalKm =
      trip.startKm && trip.endKm
        ? (
            trip.endKm - trip.startKm
          ).toFixed(2)
        : 0;

    /* ================= DETAILS TABLE ================= */

    autoTable(doc, {
      startY: 25,
      theme: "grid",
      styles: {
        fontSize: 9,
      },
      headStyles: {
        fillColor: [0, 150, 136],
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

    /* ================= MAP SECTION ================= */

    const mapElement =
      document.getElementById(
        "trip-route-map"
      );

    let nextY =
      doc.lastAutoTable.finalY + 10;

    if (mapElement) {
      try {
        doc.setFontSize(12);

        doc.text(
          "Trip Route Map",
          14,
          nextY
        );

        const canvas =
          await html2canvas(
            mapElement,
            {
              useCORS: true,
              allowTaint: true,
              scale: 2,
              logging: false,
              backgroundColor: "#ffffff",
            }
          );

        const mapImage =
          canvas.toDataURL(
            "image/png",
            1.0
          );

        doc.addImage(
          mapImage,
          "PNG",
          14,
          nextY + 5,
          180,
          75
        );

        nextY += 90;
      } catch (err) {
        console.error(
          "Map screenshot failed:",
          err
        );

        nextY += 10;
      }
    }

    /* ================= GARAGE TABLE ================= */

    autoTable(doc, {
      startY: nextY,
      theme: "grid",
      headStyles: {
        fillColor: [0, 150, 136],
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

    doc.text(
      "Customer Signature",
      14,
      signY
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
      doc.setTextColor(255, 0, 0);

      doc.text(
        "Signature unavailable",
        14,
        signY + 28
      );

      doc.setTextColor(0, 0, 0);
    }

    /* ================= EXPENSES ================= */

    if (
      trip.expenses &&
      trip.expenses.length > 0
    ) {
      autoTable(doc, {
        startY: signY + 55,
        theme: "grid",
        headStyles: {
          fillColor: [0, 150, 136],
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
