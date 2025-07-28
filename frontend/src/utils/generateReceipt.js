import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./amiri";

export const generateReceiptPDF = ({ order, customer }) => {
  const doc = new jsPDF();
  doc.setFont("Amiri-Regular");
  doc.setFontSize(16);
  doc.text("Reçu de Commande", 105, 15, { align: "center" });

  // Basic Info
  doc.setFontSize(12);
  doc.text(`Commande N°: ${order._id}`, 14, 30);
  doc.text(`Client: ${customer.name}`, 14, 38);
  doc.text(
    `Date: ${new Date(order.createdAt).toLocaleDateString("fr-FR")}`,
    14,
    46
  );

  // Table of products
  const rows = order.products.map((item) => {
    const name = item.productId?.name || "—";
    const unitPrice = item.unitPrice.toFixed(2);
    const qty = item.quantity;
    const total = (item.unitPrice * item.quantity).toFixed(2);
    return [name, unitPrice, qty, total];
  });

  autoTable(doc, {
    head: [["Produit", "Prix Unitaire", "Quantité", "Total"]],
    body: rows,
    styles: {
      font: "Amiri-Regular",
      fontSize: 12,
      halign: "right",
    },
    margin: { top: 55 },
  });

  // Totals
  let finalY = doc.lastAutoTable.finalY + 10;

  const verse = order.paidAmount || 0;
  const ancienneDette = customer.totalDebt - order.totalPrice + verse;
  const reste = customer.totalDebt;

  doc.text(`Total: ${order.totalPrice.toFixed(2)} DZD`, 14, finalY);
  finalY += 8;
  doc.text(`Ancienne crédit: ${ancienneDette.toFixed(2)} DZD`, 14, finalY);
  finalY += 8;
  doc.text(`Versé: ${verse.toFixed(2)} DZD`, 14, finalY);
  finalY += 8;
  doc.text(`Reste à régler: ${reste.toFixed(2)} DZD`, 14, finalY);
  finalY += 16;

  // Thank you message
  doc.setFontSize(12);
  doc.text("Merci pour votre confiance 🤝", 105, finalY, { align: "center" });

  // Save the PDF
  doc.save(`recu-${order._id}.pdf`);
};
