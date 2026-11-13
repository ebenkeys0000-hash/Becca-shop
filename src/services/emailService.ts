import { EmailLog, OrderDetails, User } from '../types';
import { formatFCFA } from '../utils/formatters';
import { OFFICIAL_LOGO_URL } from '../assets/images';

const LOGO_URL = OFFICIAL_LOGO_URL;

/**
 * Generates the official luxury Welcome Email HTML for BECCA SHOP
 */
export function generateWelcomeEmailHtml(user: User): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Bienvenue chez BECCA SHOP</title>
  <style>
    body { margin:0; padding:0; background-color:#0a0a0d; font-family:'Plus Jakarta Sans', -apple-system, Roboto, sans-serif; color:#f4f4f7; }
    .container { max-width:600px; margin:0 auto; background-color:#121218; border:1px solid #d4af3740; border-radius:16px; overflow:hidden; }
    .header { padding:36px 24px; text-align:center; background:linear-gradient(180deg, #1f1b13 0%, #121218 100%); border-bottom:1px solid #282834; }
    .logo { width:96px; height:96px; border-radius:50%; border:2px solid #d4af37; box-shadow:0 0 20px rgba(212,175,55,0.3); }
    .title { font-family:'Playfair Display', Georgia, serif; font-size:26px; color:#ffffff; margin:16px 0 6px 0; }
    .tagline { color:#e5c158; font-size:12px; text-transform:uppercase; letter-spacing:2px; font-weight:600; }
    .content { padding:32px 28px; line-height:1.65; color:#d4d4dc; font-size:14px; }
    .highlight { color:#e5c158; font-weight:600; }
    .box { background-color:#181822; border:1px solid #282836; border-radius:12px; padding:20px; margin:20px 0; }
    .box h4 { margin:0 0 8px 0; color:#ffffff; font-size:15px; }
    .btn { display:inline-block; padding:14px 32px; background:linear-gradient(135deg, #d4af37 0%, #c59b27 50%, #aa7c11 100%); color:#000000; font-weight:bold; font-size:13px; text-decoration:none; border-radius:30px; letter-spacing:1px; text-transform:uppercase; margin-top:12px; box-shadow:0 4px 15px rgba(212,175,55,0.3); }
    .footer { padding:24px; text-align:center; background-color:#0a0a0e; font-size:11px; color:#71717a; border-top:1px solid #1f1f28; }
    .footer a { color:#e5c158; text-decoration:none; }
  </style>
</head>
<body>
  <div style="padding:24px 12px;">
    <div class="container">
      <div class="header">
        <img src="${LOGO_URL}" alt="Logo BECCA SHOP" class="logo" />
        <h1 class="title">BECCA SHOP</h1>
        <div class="tagline">Qualité • Élégance • Votre style, notre priorité</div>
      </div>
      
      <div class="content">
        <p style="font-size:16px; margin-top:0;">Chère <strong>${user.firstName}</strong>,</p>
        
        <p>C’est un privilège de vous accueillir au sein de la Maison <span class="highlight">BECCA SHOP</span>, votre référence de mode féminine, de pagnes d'exception et de souliers de cérémonie à <strong>Comé (Bénin)</strong>.</p>
        
        <div class="box">
          <h4>👑 Deux Univers Dédiés à Votre Sublime Féminité :</h4>
          <ul style="padding-left:18px; margin:8px 0; font-size:13px; color:#a1a1aa;">
            <li><strong style="color:#ffffff;">Nos Pagnes Africains de Prestige :</strong> Véritables Super Wax hollandais aux dorures fines, soies wax royales fluides, et bazins riches Getzner brodés.</li>
            <li style="margin-top:6px;"><strong style="color:#ffffff;">Nos Chaussures Pour Femmes :</strong> Escarpins stiletto italiens, mules plates chic en cuir, et sandales à talons carrés pour un confort absolu.</li>
          </ul>
        </div>

        <div class="box" style="border-color:#d4af3750; background:#191710;">
          <h4 style="color:#e5c158;">✨ Vente au Détail & Vente en Gros (Demi-gros) :</h4>
          <p style="font-size:13px; margin:0; color:#d4d4d8;">
            Que vous commandiez pour vos propres cérémonies ou que vous soyez revendeuse ou créatrice, nous proposons des <strong>tarifs dégressifs exceptionnels en gros et demi-gros</strong> accessibles directement sur les fiches produits.
          </p>
        </div>

        <div style="text-align:center; margin:28px 0;">
          <a href="/shop" class="btn">Découvrir la Boutique en Ligne</a>
        </div>

        <p style="font-size:13px; color:#a1a1aa; border-top:1px solid #22222d; padding-top:16px;">
          Une question ou besoin d'un conseil pointure ou métrage ? Notre équipe vous répond 7j/7 directement par téléphone et WhatsApp aux numéros :
          <br>
          <strong style="color:#e5c158;">+229 95 44 16 02</strong> et <strong style="color:#e5c158;">+229 41 46 55 06</strong>.
        </p>
      </div>

      <div class="footer">
        <p>© ${new Date().getFullYear()} BECCA SHOP. Quartier Central, Route Principale, Comé, Bénin.</p>
        <p>Ce message a été adressé à ${user.email} suite à votre création de compte client.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generates Order Confirmation Email HTML
 */
export function generateOrderConfirmationEmailHtml(order: OrderDetails): string {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px; border-bottom:1px solid #262635; color:#ffffff;">
        <strong>${item.product.name}</strong><br>
        <span style="font-size:11px; color:#a1a1aa;">Réf: ${item.product.reference} | Option: ${item.selectedSize}${item.selectedColor ? ` / ${item.selectedColor}` : ''}</span>
      </td>
      <td style="padding:10px; border-bottom:1px solid #262635; text-align:center; color:#d4d4d8;">
        ${item.quantity}
      </td>
      <td style="padding:10px; border-bottom:1px solid #262635; text-align:right; font-family:monospace; color:#e5c158; font-weight:bold;">
        ${formatFCFA(item.appliedUnitPrice * item.quantity)}
      </td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Confirmation de votre Commande #${order.orderId}</title>
  <style>
    body { margin:0; padding:0; background-color:#0a0a0d; font-family:'Plus Jakarta Sans', Roboto, sans-serif; color:#f4f4f7; }
    .container { max-width:600px; margin:0 auto; background-color:#121218; border:1px solid #d4af3740; border-radius:16px; overflow:hidden; }
    .header { padding:30px 24px; text-align:center; background:#161620; border-bottom:1px solid #282834; }
    .logo { width:72px; height:72px; border-radius:50%; border:2px solid #d4af37; }
    .content { padding:28px; line-height:1.6; font-size:13px; color:#d4d4dc; }
    table { width:100%; border-collapse:collapse; margin:16px 0; font-size:12px; }
    th { background:#1c1c28; padding:8px 10px; text-align:left; color:#a1a1aa; text-transform:uppercase; font-size:10px; }
  </style>
</head>
<body>
  <div style="padding:20px 10px;">
    <div class="container">
      <div class="header">
        <img src="${LOGO_URL}" alt="BECCA SHOP" class="logo" />
        <h2 style="font-family:'Playfair Display', serif; color:#ffffff; margin:12px 0 4px 0;">Commande #${order.orderId} Confirmée</h2>
        <span style="color:#e5c158; font-size:12px; font-weight:bold;">BECCA SHOP · Comé, Bénin</span>
      </div>

      <div class="content">
        <p>Bonjour <strong>${order.customerName}</strong>,</p>
        <p>Nous avons bien reçu votre commande. Nos équipes à Comé préparent vos articles avec le plus grand soin.</p>

        <div style="background:#191924; padding:14px; border-radius:10px; margin:14px 0;">
          <p style="margin:2px 0;"><strong>Destinataire :</strong> ${order.customerName} (${order.customerPhone})</p>
          <p style="margin:2px 0;"><strong>Lieu de livraison :</strong> ${order.city} - ${order.address}</p>
          <p style="margin:2px 0;"><strong>Mode de remise :</strong> ${order.deliveryMethod === 'come_pickup' ? 'Retrait physique en boutique à Comé' : 'Livraison à domicile / Expédition'}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Article</th>
              <th style="text-align:center;">Qté</th>
              <th style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:8px 10px; text-align:right; color:#a1a1aa;">Sous-total :</td>
              <td style="padding:8px 10px; text-align:right; color:#ffffff; font-family:monospace;">${formatFCFA(order.subtotal)}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:8px 10px; text-align:right; color:#a1a1aa;">Frais de livraison :</td>
              <td style="padding:8px 10px; text-align:right; color:#ffffff; font-family:monospace;">${formatFCFA(order.shippingFee)}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:12px 10px; text-align:right; color:#ffffff; font-weight:bold; font-size:14px;">Total à régler :</td>
              <td style="padding:12px 10px; text-align:right; color:#e5c158; font-weight:bold; font-size:16px; font-family:monospace;">${formatFCFA(order.total)}</td>
            </tr>
          </tfoot>
        </table>

        <p style="font-size:12px; color:#a1a1aa;">
          Besoin d'un suivi immédiat ? Échangez directement avec nous sur WhatsApp au <strong>+229 95 44 16 02</strong>.
        </p>
      </div>

      <div style="padding:16px; text-align:center; background:#0c0c10; font-size:11px; color:#71717a;">
        BECCA SHOP · Qualité • Élégance • Votre style, notre priorité.
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generates Password Reset Email HTML
 */
export function generatePasswordResetEmailHtml(name: string, resetLink: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Réinitialisation de votre mot de passe BECCA SHOP</title>
</head>
<body style="background:#0a0a0d; font-family:sans-serif; color:#f4f4f7; padding:20px;">
  <div style="max-width:550px; margin:0 auto; background:#121218; border:1px solid #d4af3740; border-radius:14px; padding:24px; text-align:center;">
    <img src="${LOGO_URL}" style="width:70px; height:70px; border-radius:50%; border:2px solid #d4af37;" />
    <h2 style="font-family:serif; color:#ffffff; margin:16px 0 8px 0;">Réinitialisation de mot de passe</h2>
    <p style="color:#d4d4dc; font-size:14px;">Bonjour <strong>${name}</strong>,</p>
    <p style="color:#a1a1aa; font-size:13px;">Vous avez demandé la réinitialisation de votre mot de passe client sur la boutique BECCA SHOP.</p>
    <a href="${resetLink}" style="display:inline-block; padding:12px 28px; background:#d4af37; color:#000; font-weight:bold; border-radius:24px; text-decoration:none; margin:16px 0; font-size:13px;">
      Définir un nouveau mot de passe
    </a>
    <p style="color:#71717a; font-size:11px;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Creates and logs an email to memory & store
 */
export function createEmailLog(
  to: string,
  recipientName: string,
  subject: string,
  template: EmailLog['template'],
  htmlContent: string
): EmailLog {
  const log: EmailLog = {
    id: `eml_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    to,
    recipientName,
    subject,
    template,
    htmlContent,
    status: 'delivered',
    sentAt: new Date().toISOString(),
  };

  try {
    const existing: EmailLog[] = JSON.parse(localStorage.getItem('becca_email_logs') || '[]');
    existing.unshift(log);
    localStorage.setItem('becca_email_logs', JSON.stringify(existing.slice(0, 100)));
  } catch (err) {
    console.error("Erreur sauvegarde log email", err);
  }

  return log;
}
