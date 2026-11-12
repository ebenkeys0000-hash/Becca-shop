import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OrderDetails } from '../types';
import { formatFCFA, formatDate } from '../utils/formatters';
import { STORE_INFO } from '../data/products';

/**
 * Generate a consistent, sequential or derived invoice number.
 * Example: BECCA-2026-00001 or BECCA-2026-82914
 */
export function getInvoiceNumber(order: OrderDetails): string {
  if (order.invoiceNumber) {
    return order.invoiceNumber;
  }
  const cleanId = order.orderId.replace(/[^0-9]/g, '');
  const padded = cleanId.padStart(5, '0');
  const year = new Date(order.createdAt || Date.now()).getFullYear() || 2026;
  return `BECCA-${year}-${padded}`;
}

/**
 * Convert an image URL to a base64 Data URL so it can be embedded in jsPDF
 */
async function getBase64ImageFromUrl(imageUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = imageUrl;
    } catch {
      resolve(null);
    }
  });
}

/**
 * Creates and designs a high-end luxury BECCA SHOP invoice PDF
 */
export async function createInvoicePDF(order: OrderDetails): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const invoiceNum = getInvoiceNumber(order);
  const invoiceDate = formatDate(order.createdAt || new Date().toISOString());

  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Top Luxury Black & Gold Header Banner
  doc.setFillColor(14, 14, 19); // Luxury Deep Black #0e0e13
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Gold accent line under header
  doc.setFillColor(212, 175, 55); // Metallic Gold #d4af37
  doc.rect(0, 41.5, pageWidth, 1.5, 'F');

  // Try loading logo
  const logoBase64 = await getBase64ImageFromUrl(STORE_INFO.logoUrl);
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', 14, 6, 28, 28);
    } catch {
      // fallback
    }
  }

  // Brand Name in Header
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('BECCA SHOP', 46, 17);

  // Subtitle / Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(212, 175, 55);
  doc.text('PAGNES AFRICAINS & CHAUSSURES FEMMES DE PRESTIGE', 46, 23);

  doc.setFontSize(8);
  doc.setTextColor(170, 170, 185);
  doc.text('Boutique : Comé, Département du Mono – République du Bénin', 46, 28);
  doc.text('Tél / WhatsApp : +229 95 44 16 02  /  +229 41 46 55 06', 46, 33);

  // Right side of Header: "FACTURE OFFICIELLE"
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(212, 175, 55);
  doc.text('FACTURE COMMERCIALE', pageWidth - 14, 18, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(`N° ${invoiceNum}`, pageWidth - 14, 25, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 195);
  doc.text(`Date : ${invoiceDate}`, pageWidth - 14, 31, { align: 'right' });
  doc.text(`Réf. Commande : #${order.orderId}`, pageWidth - 14, 36, { align: 'right' });

  // ----------------------------------------------------------------------
  // Middle Section: Billing & Delivery Details (Two Luxury Columns)
  // ----------------------------------------------------------------------
  const boxTop = 50;
  const boxHeight = 36;
  const colWidth = (pageWidth - 28 - 6) / 2;

  // Box 1: Destinataire (Client)
  doc.setFillColor(248, 248, 250);
  doc.setDrawColor(220, 220, 230);
  doc.roundedRect(14, boxTop, colWidth, boxHeight, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(140, 105, 20); // Darker Gold
  doc.text('FACTURÉ À (CLIENTE) :', 18, boxTop + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 25);
  doc.text(order.customerName || 'Cliente Privilège', 18, boxTop + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(70, 70, 80);
  doc.text(`Téléphone : ${order.customerPhone || 'Non précisé'}`, 18, boxTop + 20);
  if (order.customerEmail) {
    doc.text(`Email : ${order.customerEmail}`, 18, boxTop + 25);
  }
  doc.text(`Ville : ${order.city || 'Comé'}, Bénin`, 18, boxTop + (order.customerEmail ? 30 : 25));

  // Box 2: Expédition & Mode de Paiement
  doc.setFillColor(248, 248, 250);
  doc.setDrawColor(220, 220, 230);
  doc.roundedRect(14 + colWidth + 6, boxTop, colWidth, boxHeight, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(140, 105, 20);
  doc.text('MODALITÉS DE LIVRAISON & RÈGLEMENT :', 18 + colWidth + 6, boxTop + 7);

  const deliveryMethodLabel =
    order.deliveryMethod === 'come_pickup'
      ? 'Retrait physique en boutique à Comé'
      : order.deliveryMethod === 'come_home'
      ? 'Livraison à domicile (Ville de Comé)'
      : 'Expédition interurbaine (Bénin)';

  const paymentMethodLabel =
    order.paymentMethod === 'delivery'
      ? 'Paiement à la livraison / retrait'
      : order.paymentMethod === 'mtn_momo'
      ? 'MTN Mobile Money Bénin (+229 95 44 16 02)'
      : order.paymentMethod === 'moov_money'
      ? 'Moov Money Bénin (+229 41 46 55 06)'
      : 'Carte bancaire Visa / Mastercard';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(20, 20, 25);
  doc.text(`Mode réception : ${deliveryMethodLabel}`, 18 + colWidth + 6, boxTop + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 80);
  doc.text(`Adresse : ${order.address || 'Boutique BECCA SHOP, Comé'}`, 18 + colWidth + 6, boxTop + 20);
  doc.text(`Règlement : ${paymentMethodLabel}`, 18 + colWidth + 6, boxTop + 25);

  const statusLabel =
    order.status === 'delivered'
      ? 'Payée & Livrée'
      : order.status === 'confirmed'
      ? 'Confirmée par la boutique'
      : order.status === 'shipped'
      ? 'En cours d\'expédition'
      : order.status === 'processing'
      ? 'En cours de préparation'
      : 'En attente de règlement';

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(order.status === 'delivered' ? 16 : 140, order.status === 'delivered' ? 140 : 100, 30);
  doc.text(`Statut commande : ${statusLabel}`, 18 + colWidth + 6, boxTop + 30);

  // ----------------------------------------------------------------------
  // Products Table (Using jspdf-autotable)
  // ----------------------------------------------------------------------
  const tableRows = order.items.map((item, index) => {
    const isWholesale = item.isWholesalePriceApplied;
    const unitPrice = item.appliedUnitPrice;
    const lineTotal = unitPrice * item.quantity;
    const itemDetails = `Réf: ${item.product.reference} | Option: ${item.selectedSize}${
      item.selectedColor ? ` | Teinte: ${item.selectedColor}` : ''
    }${isWholesale ? ' [Tarif de gros appliqué]' : ''}`;

    return [
      (index + 1).toString(),
      `${item.product.name}\n${itemDetails}`,
      item.quantity.toString(),
      formatFCFA(unitPrice),
      formatFCFA(lineTotal),
    ];
  });

  autoTable(doc, {
    startY: 92,
    head: [['#', 'Désignation de l\'article', 'Qté', 'Prix Unitaire', 'Total']],
    body: tableRows,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      textColor: [30, 30, 35],
      cellPadding: 3.5,
      lineColor: [225, 225, 235],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [18, 18, 24],
      textColor: [212, 175, 55],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 16, halign: 'center' },
      3: { cellWidth: 32, halign: 'right' },
      4: { cellWidth: 36, halign: 'right', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [252, 252, 254],
    },
  });

  // Calculate position after table
  const finalY = (doc as any).lastAutoTable.finalY + 6;

  // ----------------------------------------------------------------------
  // Summary & Totals Box
  // ----------------------------------------------------------------------
  const summaryWidth = 78;
  const summaryX = pageWidth - 14 - summaryWidth;

  // Left notes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(140, 105, 20);
  doc.text('ENGAGEMENT QUALITÉ BECCA SHOP :', 14, finalY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 100);
  doc.text('• Produits 100% originaux, tissus wax haut de gamme et cuirs sélectionnés.', 14, finalY + 10);
  doc.text('• Toute réclamation doit être signalée dans les 48h suivant la réception.', 14, finalY + 15);
  doc.text('• Pour tout échange ou renseignement, contactez-nous directement par WhatsApp.', 14, finalY + 20);
  if (order.notes) {
    doc.setFont('helvetica', 'italic');
    doc.text(`• Note client : « ${order.notes} »`, 14, finalY + 26);
  }

  // Right Financial Totals Card
  doc.setFillColor(248, 248, 250);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.roundedRect(summaryX, finalY, summaryWidth, 36, 2.5, 2.5, 'FD');

  let sY = finalY + 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(70, 70, 80);
  doc.text('Sous-total articles :', summaryX + 4, sY);
  doc.text(formatFCFA(order.subtotal), summaryX + summaryWidth - 4, sY, { align: 'right' });

  if (order.discountAmount && order.discountAmount > 0) {
    sY += 6;
    doc.setTextColor(20, 140, 50);
    doc.text(`Remise ${order.promoCode ? `(${order.promoCode})` : ''} :`, summaryX + 4, sY);
    doc.text(`-${formatFCFA(order.discountAmount)}`, summaryX + summaryWidth - 4, sY, { align: 'right' });
  }

  sY += 6;
  doc.setTextColor(70, 70, 80);
  doc.text('Frais de livraison :', summaryX + 4, sY);
  doc.text(
    order.shippingFee === 0 ? 'Offerts' : formatFCFA(order.shippingFee),
    summaryX + summaryWidth - 4,
    sY,
    { align: 'right' }
  );

  // Total Net Box
  sY += 8;
  doc.setFillColor(18, 18, 24); // Black
  doc.roundedRect(summaryX + 2, sY - 4, summaryWidth - 4, 11, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL À PAYER :', summaryX + 5, sY + 3.5);

  doc.setFontSize(11);
  doc.setTextColor(212, 175, 55); // Gold
  doc.text(formatFCFA(order.total), summaryX + summaryWidth - 5, sY + 3.5, { align: 'right' });

  // ----------------------------------------------------------------------
  // Footer Banner
  // ----------------------------------------------------------------------
  const footerY = pageHeight - 20;

  doc.setDrawColor(220, 220, 230);
  doc.setLineWidth(0.3);
  doc.line(14, footerY, pageWidth - 14, footerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(140, 105, 20);
  doc.text('BECCA SHOP – Qualité • Élégance • Votre style, notre priorité', pageWidth / 2, footerY + 5, {
    align: 'center',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 125);
  doc.text(
    'Boutique de Comé, Bénin — Vente en détail et en gros de pagnes africains & chaussures femmes',
    pageWidth / 2,
    footerY + 9,
    { align: 'center' }
  );
  doc.text(
    'Service Client : +229 95 44 16 02 / +229 41 46 55 06 | Email : contact@beccashop.bj',
    pageWidth / 2,
    footerY + 13,
    { align: 'center' }
  );

  return doc;
}

/**
 * Generates and triggers native download of the official invoice PDF
 */
export async function downloadInvoicePDF(order: OrderDetails): Promise<void> {
  const doc = await createInvoicePDF(order);
  const invoiceNum = getInvoiceNumber(order);
  doc.save(`Facture_${invoiceNum}.pdf`);
}

/**
 * Opens browser print dialog directly from generated PDF
 */
export async function printInvoicePDF(order: OrderDetails): Promise<void> {
  const doc = await createInvoicePDF(order);
  const blobUrl = doc.output('bloburl');
  const printWindow = window.open(blobUrl, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }
}
