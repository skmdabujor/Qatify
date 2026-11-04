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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shopqatify.com";
  const emailHtml = generateOrderEmailHtml(order, siteUrl);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: "Qatify Qatar <onboarding@resend.dev>",
      to: ["sheakmohammadabujor@gmail.com"],
      subject: `Order Confirmed: ${order.orderNumber} | ShopQatify.com`,
      html: emailHtml,
      text: `Shukran! Your Qatify order ${order.orderNumber} is confirmed. Total: QAR ${order.totalQAR}`,
      reply_to: "support@shopqatify.com",
    }),
  });

  const data = await res.json();
  console.log("Resend result:", data);
}

main().catch(console.error);

