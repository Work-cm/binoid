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

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
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

function formatItemLines(items = []) {
  return items
    .map((item) => {
      const price = Number(item.price ?? item.variant?.price ?? 0);
      const qty = Number(item.quantity ?? 1);
      const variant = item.variant?.grams ? ` (${item.variant.grams}g)` : '';
      return `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.name}${variant}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">x${qty}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">&euro;${(price * qty).toFixed(2)}</td>
      </tr>`;
    })
    .join('');
}

/**
 * Build the admin "new order" email (text + html).
 */
export function buildOrderNotificationEmail({ customer, items, totals, notes }) {
  const { name, email, phone, address } = customer;
  const { subtotal = 0, shipping = 0, tax = 0, total = 0 } = totals || {};

  const textLines = [
    'New Order via Email',
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

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111;">
      <h2 style="color:#0284c7;">New Order via Email</h2>
      <p><strong>Name:</strong> ${name}<br/>
         <strong>Email:</strong> ${email}<br/>
         <strong>Phone:</strong> ${phone || 'N/A'}<br/>
         <strong>Shipping Address:</strong> ${address}</p>
      ${notes ? `<p><strong>Message:</strong> ${notes}</p>` : ''}
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:8px 12px;text-align:left;">Item</th>
            <th style="padding:8px 12px;text-align:center;">Qty</th>
            <th style="padding:8px 12px;text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>${formatItemLines(items)}</tbody>
      </table>
      <p>
        Subtotal: &euro;${Number(subtotal).toFixed(2)}<br/>
        Shipping: &euro;${Number(shipping).toFixed(2)}<br/>
        Tax: &euro;${Number(tax).toFixed(2)}<br/>
        <strong>Total: &euro;${Number(total).toFixed(2)}</strong>
      </p>
    </div>`;

  return {
    to: ORDER_NOTIFICATION_EMAIL,
    replyTo: email,
    subject: `New Order — ${name} — \u20ac${Number(total).toFixed(2)}`,
    text: textLines.join('\n'),
    html,
  };
}

/**
 * Build the customer order-confirmation email.
 */
export function buildOrderConfirmationEmail({ customer, items, totals }) {
  const { name, email } = customer;
  const { total = 0 } = totals || {};

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111;">
      <h2 style="color:#0284c7;">Order Received</h2>
      <p>Hi ${name},</p>
      <p>We received your order request (total <strong>&euro;${Number(total).toFixed(2)}</strong>).
         We will reply to this email within 24 hours with our Bitcoin (BTC) or USDT
         wallet address and payment instructions.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:8px 12px;text-align:left;">Item</th>
            <th style="padding:8px 12px;text-align:center;">Qty</th>
            <th style="padding:8px 12px;text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>${formatItemLines(items)}</tbody>
      </table>
      <p style="color:#666;font-size:12px;">Payment is accepted in BTC/USDT only.</p>
    </div>`;

  return {
    to: email,
    subject: 'We received your order — BinoidStore',
    text: `Hi ${name}, we received your order request (total \u20ac${Number(total).toFixed(2)}). We will reply within 24 hours with BTC/USDT payment instructions.`,
    html,
  };
}

export default transporter;
