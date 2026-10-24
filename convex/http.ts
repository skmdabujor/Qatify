import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "standardwebhooks";

const http = httpRouter();

http.route({
  path: "/polar-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const rawBody = await req.text();
      const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

      // 1. Verify Standard Webhooks signature if POLAR_WEBHOOK_SECRET is configured
      if (webhookSecret) {
        const webhookId = req.headers.get("webhook-id");
        const webhookTimestamp = req.headers.get("webhook-timestamp");
        const webhookSignature = req.headers.get("webhook-signature");

        if (!webhookId || !webhookTimestamp || !webhookSignature) {
          console.error("[Polar Webhook] Missing signature headers");
          return new Response("Missing webhook signature headers", { status: 400 });
        }

        try {
          const wh = new Webhook(webhookSecret);
          wh.verify(rawBody, {
            "webhook-id": webhookId,
            "webhook-timestamp": webhookTimestamp,
            "webhook-signature": webhookSignature,
          });
        } catch (verifyErr) {
          console.error("[Polar Webhook] Signature verification failed:", verifyErr);
          return new Response("Invalid webhook signature", { status: 401 });
        }
      } else {
        console.warn(
          "[Polar Webhook] POLAR_WEBHOOK_SECRET is not configured in Convex environment. Skipping signature verification in dev mode."
        );
      }

      // 2. Parse and process validated webhook payload
      let body: unknown;
      try {
        body = JSON.parse(rawBody);
      } catch {
        return new Response("Invalid JSON payload", { status: 400 });
      }

      if (body && typeof body === "object" && "type" in body) {
        const eventType = (body as { type: string }).type;
        const data = (body as {
          data?: {
            id?: string;
            checkout_id?: string;
            metadata?: {
              orderNumber?: string;
              orderId?: string;
            };
          };
        }).data;

        // Polar emits 'order.created', 'order.paid', or 'checkout.updated'
        if (
          eventType === "order.created" ||
          eventType === "order.paid" ||
          eventType === "checkout.updated"
        ) {
          const checkoutId = data?.checkout_id || data?.id || "";
          const orderNumber = data?.metadata?.orderNumber;

          if (checkoutId || orderNumber) {
            await ctx.runMutation(internal.orders.markOrderAsPaid, {
              polarCheckoutId: checkoutId,
              polarOrderId: data?.id ?? "",
              orderNumber: orderNumber,
            });
            console.log(
              `[Polar Webhook] Order marked as paid for event: ${eventType}, checkout: ${checkoutId}, orderNumber: ${orderNumber}`
            );
          }
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

