async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return;
  }

  const message = [
    "🛍️ <b>[NEW ORDER RECEIVED - QATIFY]</b>",
    "━━━━━━━━━━━━━━━━━━━━━━",
    "📦 <b>Order Number:</b> #QA-896533",
    "👤 <b>Customer:</b> Mohammed Al-Sayed",
    "📞 <b>Customer Phone:</b> +974 55123456",
    "📍 <b>Delivery Address:</b> Doha, Zone 24, Al Sadd Street, Building 45, Apartment 3B",
    "💰 <b>Total Amount:</b> <b>QAR 55</b>",
    "💳 <b>Payment Method:</b> POLAR (paid)",
    "⏳ <b>Order Status:</b> <b>Pending Confirmation</b> (Waiting for Admin Approval)",
    "🚚 <b>Air Tracking:</b> <code>QA-896533</code>",
    "━━━━━━━━━━━━━━━━━━━━━━",
    "🛒 <b>Ordered Items:</b>",
    "• Porodo Multi-Functional 7-in-1 Kit (x1) - QAR 35",
    "━━━━━━━━━━━━━━━━━━━━━━",
    "🔔 <i>Please go to your Admin Dashboard to confirm and dispatch customer email!</i>",
    "🔗 <a href=\"https://shopqatify.com/dashboard\">Open Store Dashboard</a>",
  ].join("\n");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chat,
      text: message,
      parse_mode: "HTML",
    }),
  });

  const data = await res.json();
  console.log("Telegram response:", data);
}

main().catch(console.error);
