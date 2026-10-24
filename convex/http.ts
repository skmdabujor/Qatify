import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/polar-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const rawBody = await req.text();
      let body: unknown;
      try {
        body = JSON.parse(rawBody);
      } catch {
        return new Response("Invalid JSON payload", { status: 400 });
      }

      if (body && typeof body === "object" && "type" in body) {
        const eventType = (body as { type: string }).type;
        const data = (body as { data?: { id?: string; checkout_id?: string } }).data;

        if (
          (eventType === "order.created" || eventType === "order.paid") &&
          data?.checkout_id
        ) {
          await ctx.runMutation(internal.orders.markOrderAsPaid, {
            polarCheckoutId: data.checkout_id,
            polarOrderId: data.id ?? "",
          });
          console.log(`[Polar Webhook] Order marked as paid for checkout: ${data.checkout_id}`);
        }
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("[Polar Webhook] Error processing request:", err);
      return new Response("Internal Server Error", { status: 500 });
    }
  }),
});

export default http;

