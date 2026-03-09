import html2pdf from "html2pdf.js";

export function downloadDutySlipPdf() {
  const element = document.getElementById("duty-slip");

  html2pdf()
    .set({
      margin: 10,
      filename: "DutySlip.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    })
    .from(element)
    .save();
}
