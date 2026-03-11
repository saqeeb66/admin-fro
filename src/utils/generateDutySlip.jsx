import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ===== LOAD IMAGE FROM S3 ===== */
async function loadImageAsBase64(imageUrl) {
try {
if (!imageUrl) {
console.warn("Signature URL missing");
return null;
}

```
const response = await fetch(imageUrl);

if (!response.ok) {
  console.warn("Signature fetch failed:", response.status);
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
```

} catch (err) {
console.error("Error loading signature:", err);
return null;
}
}

/* ===== GENERATE DUTY SLIP ===== */
export async function generateDutySlip(dutySlip, trip, garageData) {

const doc = new jsPDF("p", "mm", "a4");

/* ===== TITLE ===== */
doc.setFontSize(16);
doc.text("DUTY SLIP", 105, 15, { align: "center" });

doc.setFontSize(9);

/* ===== TRIP DETAILS ===== */
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

/* ===== GARAGE TABLE ===== */
autoTable(doc, {
startY: doc.lastAutoTable.finalY + 6,
theme: "grid",
head: [["Type", "KM", "Time"]],
body: garageData.map((g) => [
g.type,
g.km || "-",
g.time || "-"
]),
});

/* ===== SIGNATURE ===== */
const signY = doc.lastAutoTable.finalY + 18;

doc.text("Customer Signature", 15, signY);

const base64Image = await loadImageAsBase64(trip.signatureUrl);

if (base64Image) {
doc.addImage(base64Image, "PNG", 15, signY + 4, 50, 20);
} else {
doc.text("Signature not available", 15, signY + 10);
}

/* ===== SAVE PDF ===== */
doc.save(`DutySlip-${trip.tripId}.pdf`);
}
