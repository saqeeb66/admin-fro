import { PDFDocument } from "pdf-lib";

export async function generateEditableDutySlip(trip) {

  const existingPdfBytes = await fetch("/duty-slip-template.pdf")
    .then(res => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  // PREFILL FIELDS (ONLY WHAT YOU HAVE)
  form.getTextField("CorporateName")?.setText("Arcot Cabs");
  form.getTextField("GuestName")?.setText(trip.userName || "");
  form.getTextField("GuestContact")?.setText(trip.userPhone || "");
  form.getTextField("PickupAddress")?.setText(trip.pickupLocation || "");
  form.getTextField("DropAddress")?.setText(trip.dropLocation || "");
  form.getTextField("DriverName")?.setText(trip.driverName || "");
  form.getTextField("DriverContact")?.setText(trip.driverPhone || "");
  form.getTextField("VehicleNo")?.setText(trip.driverCarNumber || "");
  form.getTextField("CarType")?.setText(trip.vehicleType || "");

  // LEAVE OTHERS EMPTY → ADMIN FILLS

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `DutySlip-${trip.tripId}.pdf`;
  link.click();
}
