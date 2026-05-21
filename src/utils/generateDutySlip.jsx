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
    console.error(err);
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
    const doc = new jsPDF(
      "p",
      "mm",
      "a4"
    );

    const totalKm =
      trip.startKm && trip.endKm
        ? (
            trip.endKm -
            trip.startKm
          ).toFixed(2)
        : 0;

    /* ================= HEADER ================= */

    doc.setFontSize(12);

    doc.text(
      `Duty #${trip.tripId}`,
      14,
      15
    );

    /* ================= LEFT DETAILS TABLE ================= */

    autoTable(doc, {
      startY: 20,
      margin: {
        left: 14,
        right: 110,
      },

      theme: "grid",

      styles: {
        fontSize: 8,
        cellPadding: 2,
      },

      body: [
        [
          "Date",
          new Date().toLocaleDateString(),
        ],

        [
          "Duty Type",
          trip.vehicleType || "-",
        ],

        [
          "Vehicle Group",
          trip.driverCarType ||
            "-",
        ],

        [
          "Vehicle",
          trip.driverCarNumber ||
            "-",
        ],

        [
          "Driver",
          trip.driverName || "-",
        ],

        [
          "Passengers",
          trip.userName || "-",
        ],

        [
          "Reporting Address",
          trip.startLocation ||
            trip.pickupLocation ||
            "-",
        ],

        [
          "Drop Address",
          trip.endLocation ||
            trip.dropLocation ||
            "-",
        ],
      ],
    });

    /* ================= MAP ================= */

    try {
      const origin =
        trip.pickupLocation ||
        trip.startLocation ||
        "";

      const destination =
        trip.dropLocation ||
        trip.endLocation ||
        "";

      const geoApiKey =
        "e7ec72691f654176b3b5228ae69bd8b4";

      const originGeo =
        await fetch(
          `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
            origin
          )}&apiKey=${geoApiKey}`
        ).then((res) =>
          res.json()
        );

      const destinationGeo =
        await fetch(
          `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
            destination
          )}&apiKey=${geoApiKey}`
        ).then((res) =>
          res.json()
        );

      const originCoords =
        originGeo?.features?.[0]
          ?.geometry?.coordinates;

      const destinationCoords =
        destinationGeo
          ?.features?.[0]
          ?.geometry
          ?.coordinates;

      if (
        originCoords &&
        destinationCoords
      ) {
        const [
          originLon,
          originLat,
        ] = originCoords;

        const [
          destLon,
          destLat,
        ] = destinationCoords;

        const staticMapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=300&marker=lonlat:${originLon},${originLat};color:%23ff0000;size:large&marker=lonlat:${destLon},${destLat};color:%2300ff00;size:large&path=stroke:%230000ff|weight:4|${originLon},${originLat}|${destLon},${destLat}&apiKey=${geoApiKey}`;

        const mapImage =
          await loadImageAsBase64(
            staticMapUrl
          );

        if (mapImage) {
          doc.addImage(
            mapImage,
            "PNG",
            110,
            20,
            85,
            55
          );
        }
      }
    } catch (err) {
      console.error(
        "Map failed",
        err
      );
    }

    /* ================= KM TABLE ================= */

    autoTable(doc, {
      startY: 85,

      theme: "grid",

      styles: {
        fontSize: 8,
        cellPadding: 2,
      },

      head: [
        [
          "",
          "G.Start",
          "Reporting",
          "Release",
          "G.End",
          "Total",
        ],
      ],

      body: [
        [
          "KM",
          trip.startKm || "0",
          trip.startKm || "0",
          trip.endKm || "0",
          trip.endKm || "0",
          totalKm,
        ],

        [
          "Time",
          garageData?.[0]?.time ||
            "-",
          garageData?.[0]?.time ||
            "-",
          garageData?.[1]?.time ||
            "-",
          garageData?.[1]?.time ||
            "-",
          "-",
        ],
      ],
    });

    /* ================= SIGNATURE ================= */

    const signY =
      doc.lastAutoTable.finalY + 20;

    doc.setFontSize(10);

    doc.text(
      "Customer Signature:",
      14,
      signY
    );

    const signature =
      await loadImageAsBase64(
        trip.signatureUrl
      );

    if (signature) {
      doc.addImage(
        signature,
        "PNG",
        14,
        signY + 5,
        50,
        25
      );
    } else {
      doc.text(
        "Signature unavailable",
        14,
        signY + 15
      );
    }

    /* ================= SAVE ================= */

    doc.save(
      `DutySlip-${trip.tripId}.pdf`
    );
  } catch (err) {
    console.error(err);
  }
}
