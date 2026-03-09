import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ===== HELPERS ===== */
const num = v => Number(v || 0);

/* ===== LOAD SIGNATURE SAFELY ===== */
async function loadImageAsBase64(tripId) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://43.205.253.229:9090/api/admin/signature/${tripId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) return null;

    const blob = await res.blob();

    return await new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateDutySlip(dutySlip, trip, garageData) {
  const doc = new jsPDF("p", "mm", "a4");

  doc.setFontSize(16);
  doc.text("DUTY SLIP", 105, 15, { align: "center" });
  doc.setFontSize(9);

  autoTable(doc, {
    startY: 25,
    theme: "grid",
    body: [
      ["Trip ID", trip.tripId, "Vehicle", trip.vehicleType],
      ["Start Location", trip.startLocation, "Start KM", trip.startKm],
      ["End Location", trip.endLocation, "End KM", trip.endKm],
      ["Driver", trip.driverName, "Phone", trip.driverPhone],
    ],
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 6,
    theme: "grid",
    head: [["Type", "KM", "Time"]],
    body: garageData.map(g => [
      g.type,
      g.km || "-",
      g.time || "-"
    ]),
  });

  const signY = doc.lastAutoTable.finalY + 18;
  doc.text("Customer Signature", 15, signY);

  const base64Img = await loadImageAsBase64(trip.tripId);
  if (base64Img) {
    doc.addImage(base64Img, "PNG", 15, signY + 4, 50, 20);
  } else {
    doc.text("Signature not available", 15, signY + 10);
  }

  doc.save(`DutySlip-${trip.tripId}.pdf`);
}
