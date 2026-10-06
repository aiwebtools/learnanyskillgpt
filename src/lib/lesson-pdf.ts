import { jsPDF } from "jspdf";
import { toPlainText } from "./teacher-api";

export function downloadLessonPdf(markdown: string, title = "Learn Any Skill GPT Lesson") {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const margin = 56;
  const brand = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(90);
    doc.text("AiWebTools.AI", width - margin, height - 28, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.text("Learn Any Skill GPT", margin, height - 28);
    doc.setTextColor(20);
  };
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, margin, margin);
  let y = margin + 28;
  brand();
  for (const raw of markdown.split("\n")) {
    const heading = /^#{1,6}\s/.test(raw);
    const line = toPlainText(raw);
    doc.setFont("helvetica", heading ? "bold" : "normal");
    doc.setFontSize(heading ? 13 : 11);
    const wrapped = line ? doc.splitTextToSize(line, width - margin * 2) : [""];
    for (const text of wrapped) {
      if (y > height - margin - 10) {
        doc.addPage();
        brand();
        y = margin;
      }
      doc.text(text, margin, y);
      y += heading ? 18 : 15;
    }
    if (heading) y += 4;
  }
  doc.save("learn-any-skill-lesson.pdf");
}
