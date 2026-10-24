# Convex HTTP Router & Webhook Ingestion

> **Official Reference**: [Convex HTTP Actions](https://docs.convex.dev/functions/http-actions)  
> **Target File**: `convex/http.ts`

---

## 1. What is the Convex HTTP Router?

Convex deployments include a public HTTP endpoint at:
`https://<deployment-name>.convex.site`

By creating `convex/http.ts`, you can define custom REST API routes, third-party webhook receivers, and health checks that run directly on Convex's global edge network.

Benefits for Qatify:
1. **Direct Webhook Handling**: Polar webhooks hit Convex directly without passing through a middleman server.
2. **Instant Consistency**: Once verified, the HTTP action triggers an `internalMutation` within sub-milliseconds.
3. **High Reliability**: Handles surges in traffic and webhook retries gracefully with built-in standard HTTP response codes.

---

## 2. Setting Up `convex/http.ts`

```typescript
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/polar-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // 1. Read raw body and signature headers
    const rawBody = await request.text();
    const webhookId = request.headers.get("webhook-id");
    const webhookTimestamp = request.headers.get("webhook-timestamp");
    const webhookSignature = request.headers.get("webhook-signature");

    if (!webhookSignature || !webhookTimestamp || !webhookId) {
      return new Response("Missing required Standard Webhook headers", { status: 400 });
    }

    const secret = process.env.POLAR_WEBHOOK_SECRET;
    if (!secret) {
      console.error("POLAR_WEBHOOK_SECRET is not configured in Convex environment");
      return new Response("Webhook secret unconfigured", { status: 500 });
    }

    // 2. Parse event payload
    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch (err) {
      return new Response("Invalid JSON body", { status: 400 });
    }

    console.log(`[Polar Webhook] Received event: ${event.type} (ID: ${event.id})`);

    // 3. Handle Polar events
    switch (event.type) {
      case "order.created":
      case "order.paid": {
        const orderData = event.data;
        const checkoutId = orderData.checkout_id;
        const polarOrderId = orderData.id;
        const polarCustomerId = orderData.customer_id;

        if (checkoutId) {
          await ctx.runMutation(internal.orders.markOrderAsPaid, {
            polarCheckoutId: checkoutId,
            polarOrderId,
            polarCustomerId,
          });
          console.log(`[Polar Webhook] Order marked as paid for checkout: ${checkoutId}`);
        }
        break;
      }

      case "checkout.updated": {
        const checkoutData = event.data;
        if (checkoutData.status === "succeeded") {
          console.log(`[Polar Webhook] Checkout succeeded: ${checkoutData.id}`);
        }
        break;
      }

      default:
        console.log(`[Polar Webhook] Unhandled event type: ${event.type}`);
    }

    // 4. Acknowledge receipt to Polar with 200 OK
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
```

---

## 3. Configuring the Webhook URL in Polar

1. Open your **Polar Dashboard** (`https://polar.sh/dashboard`).
2. Go to **Settings ➔ Webhooks**.
3. Click **Add Endpoint**.
4. Enter your Convex webhook endpoint URL:
   ```text
   https://<your-convex-deployment-name>.convex.site/polar-webhook
   ```
5. Select format **Raw** (standard JSON payload).
6. Subscribe to events:
   - `order.created`
   - `order.paid`
   - `checkout.updated`
7. Copy the generated signing secret (`whsec_...`) and store it in Convex:
   ```bash
   npx convex env set POLAR_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"
   ```

