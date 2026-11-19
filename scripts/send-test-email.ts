import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { generateOrderEmailHtml } from "../convex/emails";

const devClient = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || "https://mellow-puma-618.eu-west-1.convex.cloud"
);

async function main() {
  const adminKey = process.env.ADMIN_SECRET_KEY;
  if (!adminKey) {
    console.error("ADMIN_SECRET_KEY environment variable is required");
    return;
  }
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("RESEND_API_KEY environment variable is required");
    return;
  }

  const orders = await devClient.query(api.orders.listRecentOrders, { adminKey, limit: 1 });
  if (!orders || orders.length === 0) {
    console.error("No orders found");
    return;
  }
  const order = orders[0];
  const siteUrl = "https://shopqatify.com";
  const emailHtml = generateOrderEmailHtml(order, siteUrl);

  const customerFirstName =
    order.address?.firstName?.trim() ||
    order.address?.fullName?.trim().split(" ")[0] ||
    "Mohammed";

  // Exact Subject requested: "Thanks for your order, Mohammed! (#QA-896533)"
  const emailSubject = `Thanks for your order, ${customerFirstName}! (#${order.orderNumber})`;

  const recipientEmail = "sheakmohammadabujor@gmail.com";

  console.log(`Sending email to ${recipientEmail} with subject: "${emailSubject}"...`);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Qatify Qatar <orders@shopqatify.com>",
      to: [recipientEmail],
      subject: emailSubject,
      html: emailHtml,
      text: `Shukran! Your Qatify order ${order.orderNumber} is confirmed. Total: QAR ${order.totalQAR}. Track your air shipment live at: ${siteUrl}/track/${order.orderNumber}`,
      reply_to: "support@shopqatify.com",
    }),
  });

  const data = await res.json();
  console.log("Resend result:", data);
}

main().catch(console.error);
