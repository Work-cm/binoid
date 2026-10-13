/**
 * Gmail Email Utility
 * Sends order notification emails via Gmail SMTP using nodemailer.
 *
 * Required env vars:
 *   GMAIL_USER            - the Gmail address that sends the emails
 *   GMAIL_APP_PASSWORD    - a 16-char Google App Password (NOT your normal password)
 *                           create one at https://myaccount.google.com/apppasswords
 *                           (requires 2-Step Verification enabled on the account)
 * Optional:
 *   ORDER_NOTIFICATION_EMAIL - inbox that receives new orders (defaults to GMAIL_USER)
 *   EMAIL_FROM               - custom "From" header
 */

import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER?.trim();
// Google displays app passwords as 4 groups of 4 chars (e.g. "hfxv qzbj ...")
// — the spaces are display-only and must be stripped before SMTP auth.
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '');
const ORDER_NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || GMAIL_USER;
const EMAIL_FROM =
  process.env.EMAIL_FROM || `"BinoidStore Orders" <${GMAIL_USER}>`;

const isEmailConfigured = Boolean(GMAIL_USER && GMAIL_APP_PASSWORD);

let transporter = null;
if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });
} else {
  console.warn(
    'Gmail credentials missing (GMAIL_USER / GMAIL_APP_PASSWORD). Order emails are disabled.'
  );
}

/**
 * Send an email through the Gmail transporter.
 */
export async function sendEmail({ to, subject, text, html, replyTo }) {
  if (!transporter) {
    throw new Error(
      'Email is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env'
    );
  }

  return transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject,
    text,
    html,
    replyTo,
  });
}

/* ---------- shared email chrome ---------- */

const BRAND = '#4f46e5'; // indigo-600
const INK = '#111827';
const MUTED = '#6b7280';
const BORDER = '#e5e7eb';

/**
 * Shared branded email shell. Table-based layout + inline CSS so it renders
 * consistently in Gmail, Outlook and mobile clients.
 */
function emailLayout({ preheader, badge, heading, content }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f4f5fb;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5fb;padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${BORDER};">
        <tr><td style="background:${BRAND};padding:18px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font-family:Arial,Helvetica,sans-serif;font-size:19px;font-weight:800;color:#ffffff;letter-spacing:0.3px;">BinoidStore</td>
            <td align="right">${badge || ''}</td>
          </tr></table>
        </td></tr>
        ${heading ? `<tr><td style="padding:26px 28px 0;font-family:Arial,Helvetica,sans-serif;">
          <h1 style="margin:0;font-size:21px;font-weight:800;color:${INK};">${heading}</h1>
        </td></tr>` : ''}
        <tr><td style="padding:18px 28px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:#374151;">
          ${content}
        </td></tr>
        <tr><td style="background:#f9fafb;border-top:1px solid ${BORDER};padding:16px 28px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:${MUTED};">
          Need help? Email <a href="mailto:${ORDER_NOTIFICATION_EMAIL}" style="color:${BRAND};text-decoration:none;">${ORDER_NOTIFICATION_EMAIL}</a> or message us on Telegram <a href="https://t.me/spaceoil7" style="color:${BRAND};text-decoration:none;">@spaceoil7</a>.<br/>
          &copy; ${new Date().getFullYear()} BinoidStore &mdash; For laboratory research use only. Not for human consumption.
        </td></tr>
      </table>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#9ca3af;padding:12px 0 0;">BinoidStore &middot; Discreet worldwide shipping &middot; BTC / USDT accepted</div>
    </td></tr>
  </table>
</body>
</html>`;
}

const pill = (text) =>
  `<span style="display:inline-block;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.35);color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:5px 12px;border-radius:999px;">${text}</span>`;

const infoRow = (label, value) => `<tr>
  <td style="padding:5px 0;color:${MUTED};width:140px;vertical-align:top;font-size:13px;">${label}</td>
  <td style="padding:5px 0;color:${INK};font-weight:600;font-size:13px;">${value}</td>
</tr>`;

function itemsTable(items = []) {
  const rows = items
    .map((item) => {
      const price = Number(item.price ?? item.variant?.price ?? 0);
      const qty = Number(item.quantity ?? 1);
      const variant = item.variant?.grams
        ? `<span style="display:block;font-size:11px;color:${MUTED};margin-top:2px;">${item.variant.grams}g</span>`
        : '';
      return `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eef0f4;color:${INK};font-size:13px;">${item.name}${variant}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eef0f4;text-align:center;color:${MUTED};font-size:13px;">&times;${qty}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eef0f4;text-align:right;color:${INK};font-weight:600;font-size:13px;">&euro;${(price * qty).toFixed(2)}</td>
      </tr>`;
    })
    .join('');

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:8px;overflow:hidden;margin:16px 0;">
    <thead><tr>
      <th style="padding:9px 12px;text-align:left;background:#f3f4f6;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${MUTED};">Item</th>
      <th style="padding:9px 12px;text-align:center;background:#f3f4f6;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${MUTED};width:60px;">Qty</th>
      <th style="padding:9px 12px;text-align:right;background:#f3f4f6;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${MUTED};width:90px;">Amount</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function totalsTable({ subtotal = 0, shipping = 0, tax = 0, total = 0 } = {}) {
  const row = (label, value, bold = false) => `<tr>
    <td style="padding:5px 0;color:${MUTED};font-size:13px;${bold ? 'font-weight:700;color:' + INK + ';' : ''}">${label}</td>
    <td style="padding:5px 0;text-align:right;font-size:13px;${bold ? 'font-weight:800;color:' + BRAND + ';font-size:15px;' : 'color:' + INK + ';'}">&euro;${Number(value).toFixed(2)}</td>
  </tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 0;">
    ${row('Subtotal', subtotal)}
    ${row('Shipping', shipping)}
    ${tax ? row('Tax', tax) : ''}
    <tr><td colspan="2" style="border-top:1px solid ${BORDER};padding:0;"></td></tr>
    ${row('Total', total, true)}
  </table>`;
}

/**
 * Build the admin "new order" email (text + html).
 */
export function buildOrderNotificationEmail({ customer, items, totals, notes, orderRef }) {
  const { name, email, phone, address } = customer;
  const { subtotal = 0, shipping = 0, tax = 0, total = 0 } = totals || {};

  const textLines = [
    `New Order${orderRef ? ` ${orderRef}` : ''}`,
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || 'N/A'}`,
    `Shipping Address: ${address}`,
    notes ? `Message: ${notes}` : null,
    '',
    'Items:',
    ...(items || []).map((i) => {
      const price = Number(i.price ?? i.variant?.price ?? 0);
      const variant = i.variant?.grams ? ` (${i.variant.grams}g)` : '';
      return `- ${i.name}${variant} x${i.quantity} @ \u20ac${price.toFixed(2)}`;
    }),
    '',
    `Subtotal: \u20ac${Number(subtotal).toFixed(2)}`,
    `Shipping: \u20ac${Number(shipping).toFixed(2)}`,
    `Tax: \u20ac${Number(tax).toFixed(2)}`,
    `Total: \u20ac${Number(total).toFixed(2)}`,
  ].filter((l) => l !== null);

  const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:8px;padding:16px;background:#f9fafb;margin:14px 0 4px;">
      ${infoRow('Customer', name)}
      ${infoRow('Email', `<a href="mailto:${email}" style="color:${BRAND};text-decoration:none;">${email}</a>`)}
      ${infoRow('Phone', phone || 'N/A')}
      ${infoRow('Ship to', address)}
      ${infoRow('Placed', new Date().toUTCString())}
    </table>
    ${notes ? `<div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:12px 16px;margin:14px 0;font-size:13px;color:#9a3412;"><strong>Customer message:</strong> ${notes}</div>` : ''}
    ${itemsTable(items)}
    ${totalsTable({ subtotal, shipping, tax, total })}
    <p style="margin:16px 0 0;font-size:12px;color:${MUTED};">Reply directly to this email to respond to the customer. The same order is also saved in the admin dashboard.</p>`;

  const html = emailLayout({
    preheader: `New order${orderRef ? ` ${orderRef}` : ''} from ${name} — \u20ac${Number(total).toFixed(2)}`,
    badge: pill('New order'),
    heading: `New order received${orderRef ? ` <span style="color:${MUTED};font-size:15px;font-weight:600;">${orderRef}</span>` : ''}`,
    content,
  });

  return {
    to: ORDER_NOTIFICATION_EMAIL,
    replyTo: email,
    subject: `New Order${orderRef ? ` ${orderRef}` : ''} — ${name} — \u20ac${Number(total).toFixed(2)}`,
    text: textLines.join('\n'),
    html,
  };
}

/**
 * Build the customer order-confirmation email.
 */
export function buildOrderConfirmationEmail({ customer, items, totals, orderRef }) {
  const { name, email } = customer;
  const { subtotal = 0, shipping = 0, tax = 0, total = 0 } = totals || {};

  const content = `
    <p style="margin:0 0 14px;">Hi ${name},</p>
    <p style="margin:0 0 4px;">Thanks for your order${orderRef ? ` — your reference is <strong>${orderRef}</strong>` : ''}.
    We have received it and a member of our team will reply <strong>within 24 hours</strong>
    with your Bitcoin (BTC) or USDT wallet address and payment instructions.</p>
    ${itemsTable(items)}
    ${totalsTable({ subtotal, shipping, tax, total })}
    <div style="background:#eef2ff;border:1px solid #c7d2fe;border-radius:8px;padding:14px 16px;margin:18px 0 0;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${BRAND};">What happens next</p>
      <p style="margin:0;font-size:13px;color:#3730a3;line-height:1.6;">
        1. We confirm stock and reply to this email with the payment address.<br/>
        2. You pay in BTC or USDT and share the transaction hash.<br/>
        3. Your order ships within 48h in plain, unmarked packaging with tracking.
      </p>
    </div>
    <p style="margin:16px 0 0;font-size:12px;color:${MUTED};">Payment is accepted in Bitcoin (BTC) and USDT only. Please keep your order reference for any questions.</p>`;

  const html = emailLayout({
    preheader: `We received your order${orderRef ? ` ${orderRef}` : ''} — payment instructions follow within 24h`,
    badge: pill('Order received'),
    heading: 'We received your order',
    content,
  });

  return {
    to: email,
    subject: `Order received${orderRef ? ` — ${orderRef}` : ''} — BinoidStore`,
    text: `Hi ${name}, we received your order${orderRef ? ` (${orderRef})` : ''} (total \u20ac${Number(total).toFixed(2)}). We will reply within 24 hours with BTC/USDT payment instructions.`,
    html,
  };
}

export default transporter;
