import jsPDF from "jspdf";

const generateInvoicePDF = (invoice, accentColor = "#818cf8") => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header background
  doc.setFillColor(15, 14, 26);
  doc.rect(0, 0, pageWidth, 45, "F");

  // Logo
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("ClientFlow", 20, 20);

  // Invoice title
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 160, 200);
  doc.text("INVOICE", 20, 32);

  // Invoice number top right
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(invoice.invoiceNumber, pageWidth - 20, 20, { align: "right" });
  doc.setFontSize(9);
  doc.setTextColor(160, 160, 200);
  doc.text(
    invoice.dueDate
      ? `Due: ${new Date(invoice.dueDate).toLocaleDateString()}`
      : "No due date",
    pageWidth - 20, 30, { align: "right" }
  );

  // Accent line
  doc.setDrawColor(129, 140, 248);
  doc.setLineWidth(0.8);
  doc.line(0, 45, pageWidth, 45);

  // Bill To section
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(120, 120, 150);
  doc.text("BILL TO", 20, 60);

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 40);
  doc.text(invoice.clientName, 20, 70);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 130);
  doc.text(invoice.clientEmail, 20, 78);

  // Status badge
  const statusColors = {
    Paid:    [52, 211, 153],
    Sent:    [56, 189, 248],
    Draft:   [148, 163, 184],
    Overdue: [248, 113, 113],
  };
  const sc = statusColors[invoice.status] || statusColors.Draft;
  doc.setFillColor(sc[0], sc[1], sc[2]);
  doc.roundedRect(pageWidth - 55, 58, 35, 10, 3, 3, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(invoice.status.toUpperCase(), pageWidth - 37.5, 65, { align: "center" });

  // Divider
  doc.setDrawColor(230, 230, 240);
  doc.setLineWidth(0.3);
  doc.line(20, 88, pageWidth - 20, 88);

  // Table header
  const tableY = 96;
  doc.setFillColor(245, 245, 255);
  doc.rect(20, tableY - 6, pageWidth - 40, 10, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 140);
  doc.text("DESCRIPTION", 24, tableY);
  doc.text("QTY", pageWidth - 95, tableY, { align: "right" });
  doc.text("RATE", pageWidth - 60, tableY, { align: "right" });
  doc.text("AMOUNT", pageWidth - 20, tableY, { align: "right" });

  // Table rows
  let y = tableY + 12;
  invoice.items.forEach((item, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(250, 250, 255);
      doc.rect(20, y - 6, pageWidth - 40, 10, "F");
    }
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 50);
    doc.text(item.description || "—", 24, y);
    doc.setTextColor(80, 80, 110);
    doc.text(String(item.quantity), pageWidth - 95, y, { align: "right" });
    doc.text(`Rs.${item.rate.toLocaleString()}`, pageWidth - 60, y, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 50);
    doc.text(`Rs.${item.amount.toLocaleString()}`, pageWidth - 20, y, { align: "right" });
    y += 12;
  });

  // Summary box
  y += 6;
  doc.setDrawColor(230, 230, 240);
  doc.setLineWidth(0.3);
  doc.line(20, y, pageWidth - 20, y);
  y += 10;

  const summaryX = pageWidth - 80;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 130);
  doc.text("Subtotal", summaryX, y);
  doc.setTextColor(30, 30, 50);
  doc.text(`Rs.${invoice.subtotal.toLocaleString()}`, pageWidth - 20, y, { align: "right" });

  y += 10;
  doc.setTextColor(100, 100, 130);
  doc.text(`Tax (${invoice.tax}%)`, summaryX, y);
  doc.setTextColor(30, 30, 50);
  doc.text(
    `Rs.${((invoice.subtotal * invoice.tax) / 100).toLocaleString()}`,
    pageWidth - 20, y, { align: "right" }
  );

  y += 4;
  doc.setDrawColor(129, 140, 248);
  doc.setLineWidth(0.5);
  doc.line(summaryX, y, pageWidth - 20, y);
  y += 8;

  // Total
  doc.setFillColor(129, 140, 248);
  doc.roundedRect(summaryX - 4, y - 6, pageWidth - summaryX - 16, 12, 2, 2, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL", summaryX, y);
  doc.text(`Rs.${invoice.total.toLocaleString()}`, pageWidth - 20, y, { align: "right" });

  // Notes
  if (invoice.notes) {
    y += 20;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(120, 120, 150);
    doc.text("NOTES", 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 110);
    const lines = doc.splitTextToSize(invoice.notes, pageWidth - 40);
    doc.text(lines, 20, y);
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 14;
  doc.setFillColor(15, 14, 26);
  doc.rect(0, footerY - 6, pageWidth, 20, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 160, 200);
  doc.text("Generated by ClientFlow", 20, footerY);
  doc.text(new Date().toLocaleDateString(), pageWidth - 20, footerY, { align: "right" });

  doc.save(`${invoice.invoiceNumber}.pdf`);
};

export default generateInvoicePDF;