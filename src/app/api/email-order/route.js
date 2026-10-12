import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/utils/db';
import Order from '@/models/Order';
import {
  sendEmail,
  buildOrderNotificationEmail,
  buildOrderConfirmationEmail,
} from '@/lib/utils/email';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST - Place an order via email (Gmail)
export async function POST(request) {
  try {
    const body = await request.json();

    const customer = {
      name: String(body.name || '').trim(),
      email: String(body.email || '').trim(),
      phone: String(body.phone || '').trim(),
      address: String(body.address || '').trim(),
    };
    const notes = String(body.notes || '').trim();
    const items = Array.isArray(body.items) ? body.items : [];

    // Validation
    if (!customer.name || !customer.email || !customer.address) {
      return NextResponse.json(
        { message: 'Name, email and shipping address are required' },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(customer.email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }
    if (items.length === 0) {
      return NextResponse.json(
        { message: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Compute totals server-side
    const itemsPrice = items.reduce(
      (sum, i) => sum + Number(i.price ?? i.variant?.price ?? 0) * Number(i.quantity ?? 1),
      0
    );
    const shippingPrice = 40;
    const taxPrice = 0;
    const totals = {
      subtotal: itemsPrice,
      shipping: shippingPrice,
      tax: taxPrice,
      total: itemsPrice + shippingPrice + taxPrice,
    };

    // Persist the order first so it survives email failures and we have a real order ID
    let orderId = null;
    try {
      const conn = await dbConnect();
      if (conn) {
        const orderItems = items.map((item) => ({
          name: item.name,
          quantity: Number(item.quantity ?? 1),
          image: item.image || '/images/placeholder.png',
          price: Number(item.price ?? item.variant?.price ?? 0),
          product: mongoose.Types.ObjectId.isValid(item.id || item.product)
            ? (item.id || item.product)
            : new mongoose.Types.ObjectId(),
        }));

        const newOrder = new Order({
          user: new mongoose.Types.ObjectId(), // guest email order — no account
          orderItems,
          shippingAddress: {
            fullName: customer.name,
            address: customer.address,
            city: 'N/A',
            postalCode: 'N/A',
            country: 'N/A',
          },
          paymentMethod: 'Email Order (BTC/USDT)',
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice: totals.total,
          isPaid: false,
          isDelivered: false,
          status: 'pending',
        });

        const saved = await newOrder.save();
        orderId = saved._id;
      }
    } catch (dbErr) {
      console.error('Failed to persist email order in DB:', dbErr);
    }

    const orderRef = `BN-${(orderId || mongoose.Types.ObjectId.createFromTime(Math.floor(Date.now() / 1000))).toString().slice(-6).toUpperCase()}`;

    // Send the order email to the store inbox (Gmail)
    await sendEmail(
      buildOrderNotificationEmail({ customer, items, totals, notes, orderRef })
    );

    // Instant reply to the customer (non-blocking — don't fail the order if it bounces)
    sendEmail(buildOrderConfirmationEmail({ customer, items, totals, orderRef })).catch(
      (err) => console.error('Failed to send customer confirmation email:', err)
    );

    return NextResponse.json(
      { message: 'Order sent via email', orderId, orderRef },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing email order:', error);
    const status = error.message?.includes('not configured') ? 503 : 500;
    return NextResponse.json(
      { message: error.message || 'Failed to send order email' },
      { status }
    );
  }
}
