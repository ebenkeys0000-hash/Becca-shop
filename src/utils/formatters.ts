import { CartItem, OrderDetails, Product } from '../types';

/**
 * Format a number into FCFA currency string, e.g. "38 500 FCFA"
 */
export function formatFCFA(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "0 FCFA";
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formatted} FCFA`;
}

/**
 * Format date string into readable French format, e.g. "30 Oct 2026 à 10:30"
 */
export function formatDate(isoString: string): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoString;
  }
}

/**
 * Clean phone number for tel: or wa.me links
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Build WhatsApp click-to-chat URL with pre-filled message for an order
 */
export function generateWhatsAppOrderUrl(
  phoneNumber: string,
  order: OrderDetails
): string {
  const cleanPhone = sanitizePhone(phoneNumber);
  
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.product.name}*\n   - Réf: ${item.product.reference}\n   - Quantité: ${item.quantity}\n   - Variante: ${item.selectedSize}${item.selectedColor ? ` / ${item.selectedColor}` : ''}\n   - Prix unitaire: ${formatFCFA(item.product.price)}`
    )
    .join('\n\n');

  const deliveryMethodLabel =
    order.deliveryMethod === 'come_pickup'
      ? 'Retrait physique en boutique à Comé'
      : order.deliveryMethod === 'come_home'
      ? 'Livraison à domicile (Comé)'
      : 'Expédition interurbaine (Bénin)';

  const text = `👑 *NOUVELLE COMMANDE BECCA SHOP*\n` +
    `----------------------------------------\n` +
    `*N° Commande:* #${order.orderId}\n` +
    `*Nom Cliente:* ${order.customerName}\n` +
    `*Téléphone:* ${order.customerPhone}\n` +
    `*Ville / Quartier:* ${order.city} - ${order.address}\n` +
    `*Mode d'expédition:* ${deliveryMethodLabel}\n` +
    (order.notes ? `*Instructions:* ${order.notes}\n` : '') +
    `----------------------------------------\n` +
    `*ARTICLES COMMANDÉS:*\n${itemsText}\n` +
    `----------------------------------------\n` +
    `*Sous-total:* ${formatFCFA(order.subtotal)}\n` +
    `*Frais de livraison:* ${formatFCFA(order.shippingFee)}\n` +
    `*TOTAL À REGLER:* *${formatFCFA(order.total)}*\n` +
    `----------------------------------------\n` +
    `Bonjour BECCA SHOP, je confirme ma commande sur votre plateforme. Merci de m'indiquer la suite de la livraison.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Build WhatsApp click-to-chat URL for an instant product inquiry / direct order
 */
export function generateWhatsAppProductUrl(
  phoneNumber: string,
  product: Product,
  size?: string,
  color?: string
): string {
  const cleanPhone = sanitizePhone(phoneNumber);
  const text = `Bonjour BECCA SHOP ! 👑\n\n` +
    `Je souhaite commander l'article suivant depuis votre boutique en ligne :\n\n` +
    `✨ *${product.name}*\n` +
    `📌 Référence : ${product.reference}\n` +
    `💰 Prix : ${formatFCFA(product.price)}\n` +
    (size ? `📏 Taille / Longueur : ${size}\n` : '') +
    (color ? `🎨 Couleur : ${color}\n` : '') +
    `\nPouvez-vous me confirmer la disponibilité et les modalités de livraison à Comé ou ailleurs au Bénin ? Merci !`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
