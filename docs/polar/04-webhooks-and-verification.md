# Polar Webhooks & Signature Verification

> **Official Reference**: [Polar Webhooks Guide](https://polar.sh/docs/api-reference/2026-10/webhooks)  
> **Specification**: Standard Webhooks (HMAC-SHA256)

---

## 1. Standard Webhooks Specification (2026)

All Polar webhooks adhere strictly to the **Standard Webhooks** specification. Every request sent by Polar includes three critical verification headers:

| Header Name | Description |
| :--- | :--- |
| `webhook-id` | Unique identifier for the webhook message |
| `webhook-timestamp` | Unix timestamp (in seconds) of when the request was dispatched |
| `webhook-signature` | Space-delimited list of signatures (e.g. `v1,g34... v1,a72...`) |

---

## 2. Supported Event Types

| Event Type | Trigger | Action in Qatify |
| :--- | :--- | :--- |
| `order.created` | New order placed | Verifies order details |
| `order.paid` | Payment cleared by banking partner | Marks order as `paid`, sets status to `processing`, starts 6–10 day delivery countdown |
| `checkout.updated` | Checkout state changed | Logs abandonment or expiration |
| `refund.created` | Order refunded | Updates order status to `refunded`, initiates inventory return |

---

## 3. Webhook Signature Verification

### Option A: Using `standardwebhooks` Package (Recommended)

Install the lightweight Standard Webhook validator:
```bash
npm install standardwebhooks
```

Verification implementation:

```typescript
import { Webhook } from "standardwebhooks";

export function verifyPolarWebhook({
  rawBody,
  headers,
  secret,
}: {
  rawBody: string;
  headers: Record<string, string>;
  secret: string;
}) {
  const wh = new Webhook(secret);

  try {
    const payload = wh.verify(rawBody, headers);
    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
}
```

### Option B: Native Web Crypto Verification (Zero Dependencies, Node 18+)

```typescript
export async function verifySignatureNative(
  rawBody: string,
  headers: { id: string; timestamp: string; signature: string },
  secret: string
): Promise<boolean> {
  const secretKey = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  const keyBytes = Uint8Array.from(atob(secretKey), (c) => c.charCodeAt(0));

  // Construct signed content
  const signedPayload = `${headers.id}.${headers.timestamp}.${rawBody}`;
  const encoder = new TextEncoder();

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(signedPayload)
  );

  const computedSig = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));

  // Extract signatures (format: v1,<base64>)
  const signatures = headers.signature.split(" ").map((s) => s.split(",")[1]);
  return signatures.includes(computedSig);
}
```

---

## 4. Local Webhook Testing with Polar CLI

You do not need ngrok or external tunnels when developing locally. Use the official Polar CLI:

```bash
# 1. Start listening and forwarding to your local dev server
polar webhook listen http://localhost:3000/api/webhooks/polar

# 2. In another terminal, trigger a simulated test event
polar webhook trigger order.paid
```

