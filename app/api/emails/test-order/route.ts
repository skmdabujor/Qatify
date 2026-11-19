import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { generateOrderEmailHtml } from '@/convex/emails';

const devClient = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || 'https://mellow-puma-618.eu-west-1.convex.cloud'
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { orderNumber, recipientEmail = 'sheakmohammadabujor@gmail.com' } = body;

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json(
        { success: false, error: 'RESEND_API_KEY is not configured in server environment' },
        { status: 500 }
      );
    }

    let order = null;
    if (orderNumber) {
      order = await devClient.query(api.orders.getByOrderNumber, { orderNumber });
    }

    if (!order) {
      const adminKey = process.env.ADMIN_SECRET_KEY;
      if (adminKey) {
        const recentOrders = await devClient.query(api.orders.listRecentOrders, {
          adminKey,
          limit: 1,
        });
        if (recentOrders && recentOrders.length > 0) {
          order = recentOrders[0];
        }
      }
    }

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'No order found to generate email confirmation' },
        { status: 404 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shopqatify.com';
    const emailHtml = generateOrderEmailHtml(order, siteUrl);

    const customerFirstName =
      order.address?.firstName?.trim() ||
      order.address?.fullName?.trim().split(' ')[0] ||
      'Mohammed';

    // Format requested by user: "Thanks for your order, Mohammed! (#QA-896533)"
    const emailSubject = `Thanks for your order, ${customerFirstName}! (#${order.orderNumber})`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Qatify Qatar <orders@shopqatify.com>',
        to: [recipientEmail],
        subject: emailSubject,
        html: emailHtml,
        text: `Shukran! Your Qatify order ${order.orderNumber} is confirmed. Total: QAR ${order.totalQAR}. Track your shipment live at: ${siteUrl}/track/${order.orderNumber}`,
        reply_to: 'support@shopqatify.com',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { success: false, error: errText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      emailId: data.id,
      orderNumber: order.orderNumber,
      recipient: recipientEmail,
      subject: emailSubject,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
