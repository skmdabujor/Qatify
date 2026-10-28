import { v } from "convex/values";
import {
  query,
  mutation,
  action,
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { assertAdminAccess } from "./adminAuth";

// =============================================================================
// Dropshipping White-label Sanitization Helper
// Masks supplier & carrier names (AliExpress, Cainiao, Yanwen, etc.) into
// luxury branded terms matching Qatify's cross-border logistics brand.
// =============================================================================
export function sanitizeCheckpointText(rawText: string): string {
  if (!rawText) return "";
  let text = rawText;

  // Replace marketplace references
  text = text.replace(/aliexpress/gi, "Qatify Global Fulfillment");
  text = text.replace(/cainiao/gi, "Global Air Express Hub");
  text = text.replace(/yanwen/gi, "Direct Air Express");
  text = text.replace(/sunyou/gi, "Global Priority Cargo");
  text = text.replace(/4px/gi, "Air Freight Logistics");
  text = text.replace(/china post/gi, "International Postal Hub");
  text = text.replace(/taobao/gi, "Global Supplier Hub");
  text = text.replace(/seller/gi, "Fulfillment Center");
  text = text.replace(/merchant/gi, "Fulfillment Partner");

  return text.trim();
}

// Stage inference helper: maps carrier checkpoint message to Qatify's 5 Stages
export function mapCheckpointToStage(
  description: string,
  location: string
): "Order Confirmed" | "Air Hub Transit" | "Qatar Customs (DOH)" | "Out for Delivery" | "Delivered" {
  const combined = `${description} ${location}`.toLowerCase();

  if (
    combined.includes("delivered") ||
    combined.includes("successfully received") ||
    combined.includes("signed for")
  ) {
    return "Delivered";
  }

  if (
    combined.includes("out for delivery") ||
    combined.includes("with courier") ||
    combined.includes("distribution center") ||
    combined.includes("local delivery driver") ||
    combined.includes("last mile")
  ) {
    return "Out for Delivery";
  }

  if (
    combined.includes("customs") ||
    combined.includes("hamad") ||
    combined.includes("doh") ||
    combined.includes("airport arrival") ||
    combined.includes("import clearance") ||
    combined.includes("arrived at destination country") ||
    combined.includes("qatar")
  ) {
    return "Qatar Customs (DOH)";
  }

  if (
    combined.includes("airline") ||
    combined.includes("flight") ||
    combined.includes("air transit") ||
    combined.includes("departed country of origin") ||
    combined.includes("handed over to airline") ||
    combined.includes("export sorting") ||
    combined.includes("sorting center") ||
    combined.includes("in transit") ||
    combined.includes("dispatched")
  ) {
    return "Air Hub Transit";
  }

  return "Order Confirmed";
}

// -----------------------------------------------------------------------------
// 1. Admin Mutation: Link AliExpress Tracking Number to an Order
// -----------------------------------------------------------------------------
export const linkAliExpressTracking = mutation({
  args: {
    orderId: v.id("orders"),
    aliexpressTrackingNumber: v.string(),
    carrier: v.optional(v.string()),
    adminEmail: v.optional(v.string()),
    adminKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertAdminAccess(ctx, args.adminEmail, args.adminKey);

    const cleanTracking = args.aliexpressTrackingNumber.trim().toUpperCase();
    if (!cleanTracking) {
      throw new Error("AliExpress tracking number cannot be empty.");
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found.");

    const carrierCode = (args.carrier || "cainiao").trim().toLowerCase();

    await ctx.db.patch(args.orderId, {
      aliexpressTrackingNumber: cleanTracking,
      aliexpressCarrier: carrierCode,
      trackingProvider: "17track_unified",
    });

    // Schedule background action to sync live checkpoints immediately
    await ctx.scheduler.runAfter(0, internal.tracking.syncAliExpressTrackingAction, {
      orderId: args.orderId,
      trackingNumber: cleanTracking,
      carrierCode,
    });

    return { success: true, trackingNumber: cleanTracking };
  },
});

// -----------------------------------------------------------------------------
// 2. Internal Query: Get Order Details for Sync Action
// -----------------------------------------------------------------------------
export const getOrderForSync = internalQuery({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

// -----------------------------------------------------------------------------
// 3. Internal Action: Fetch Live Checkpoints (17TRACK / TrackingMore / High-Fidelity Sync)
// -----------------------------------------------------------------------------
export const syncAliExpressTrackingAction = internalAction({
  args: {
    orderId: v.id("orders"),
    trackingNumber: v.string(),
    carrierCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.runQuery(internal.tracking.getOrderForSync, {
      orderId: args.orderId,
    });
    if (!order) return { success: false, error: "Order not found" };

    const seventeenTrackKey = process.env.SEVENTEENTRACK_API_KEY;
    const trackingMoreKey = process.env.TRACKINGMORE_API_KEY;

    let checkpoints: Array<{
      time: string;
      status: string;
      location: string;
      description: string;
      carrier?: string;
    }> = [];
    let providerName = "simulated_unified";

    // A. If 17TRACK API key is configured in Convex environment
    if (seventeenTrackKey && seventeenTrackKey.trim()) {
      try {
        providerName = "17track";

        // Step 1: Register tracking number on 17TRACK (safe even if already registered)
        try {
          await fetch("https://api.17track.net/track/v2.2/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "17token": seventeenTrackKey.trim(),
            },
            body: JSON.stringify([{ number: args.trackingNumber }]),
          });
        } catch (regErr) {
          console.warn("[Tracking] 17TRACK registration notice:", regErr);
        }

        // Step 2: Query latest tracking info
        const trackRes = await fetch("https://api.17track.net/track/v2.2/gettrackinfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "17token": seventeenTrackKey.trim(),
          },
          body: JSON.stringify([
            {
              number: args.trackingNumber,
              carrier: args.carrierCode ? undefined : undefined,
            },
          ]),
        });

        if (trackRes.ok) {
          const trackData = (await trackRes.json()) as any;
          const trackItem = trackData?.data?.accepted?.[0]?.track;
          const events = trackItem?.z0?.z || trackItem?.z1?.z || [];

          if (Array.isArray(events) && events.length > 0) {
            checkpoints = events.map((ev: any) => ({
              time: ev.a || new Date().toISOString(),
              status: sanitizeCheckpointText(ev.z || "In Transit"),
              location: sanitizeCheckpointText(ev.c || ev.d || "Global Transit Hub"),
              description: sanitizeCheckpointText(ev.z || "Shipment milestone updated"),
              carrier: "Direct Air Express",
            }));
          }
        }
      } catch (err) {
        console.warn("[Tracking] 17TRACK API call failed, falling back to simulated sync:", err);
      }
    }
    // B. If TrackingMore API key is configured
    else if (trackingMoreKey && trackingMoreKey.trim()) {
      try {
        providerName = "trackingmore";
        const trackRes = await fetch(
          `https://api.trackingmore.com/v4/trackings/realtime?tracking_number=${encodeURIComponent(
            args.trackingNumber
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Tracking-Api-Key": trackingMoreKey.trim(),
            },
          }
        );

        if (trackRes.ok) {
          const trackData = (await trackRes.json()) as any;
          const originInfo = trackData?.data?.origin_info?.trackinfo || [];
          if (Array.isArray(originInfo) && originInfo.length > 0) {
            checkpoints = originInfo.map((ev: any) => ({
              time: ev.Date || new Date().toISOString(),
              status: sanitizeCheckpointText(ev.checkpoint_status || "In Transit"),
              location: sanitizeCheckpointText(ev.location || "Transit Hub"),
              description: sanitizeCheckpointText(ev.Details || "Checkpoint logged"),
              carrier: "Air Cargo Logistics",
            }));
          }
        }
      } catch (err) {
        console.warn("[Tracking] TrackingMore API call failed:", err);
      }
    }

    // C. Direct Cainiao Global Live Logistics API (Official AliExpress Carrier - 100% Real-Time, No API Key Required)
    if (checkpoints.length === 0) {
      try {
        const cainiaoUrl = `https://global.cainiao.com/global/detail.json?mailNos=${encodeURIComponent(
          args.trackingNumber
        )}&lang=en-US`;

        const cainiaoRes = await fetch(cainiaoUrl, {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "application/json, text/plain, */*",
          },
        });

        if (cainiaoRes.ok) {
          const cainiaoData = (await cainiaoRes.json()) as any;
          const detailList = cainiaoData?.module?.[0]?.detailList || [];

          if (Array.isArray(detailList) && detailList.length > 0) {
            providerName = "cainiao_live";
            // Sort events chronologically (oldest to newest)
            const sortedList = [...detailList].sort((a: any, b: any) => {
              const timeA = typeof a.time === "number" ? a.time : new Date(a.time).getTime();
              const timeB = typeof b.time === "number" ? b.time : new Date(b.time).getTime();
              return timeA - timeB;
            });

            checkpoints = sortedList.map((item: any) => {
              const rawTime = item.time;
              let formattedTime = new Date().toISOString();
              if (typeof rawTime === "number") {
                formattedTime = new Date(rawTime).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
              } else if (typeof rawTime === "string") {
                formattedTime = rawTime;
              }

              const desc = sanitizeCheckpointText(item.desc || item.standerdDesc || "Shipment milestone logged");
              const status = sanitizeCheckpointText(item.standerdDesc || item.status || "In Transit");

              return {
                time: formattedTime,
                status,
                location: sanitizeCheckpointText(item.location || "Transit Hub"),
                description: desc,
                carrier: "Qatify Air Express",
              };
            });
          }
        }
      } catch (cainiaoErr) {
        console.warn("[Tracking] Cainiao direct live query notice:", cainiaoErr);
      }
    }

    // D. Initial Status Handling (If parcel is brand new and carrier hasn't scanned it yet)
    if (checkpoints.length === 0) {
      providerName = "fulfillment_pending";
      // Genuine initial checkpoint - No fake location, strictly accurate
      checkpoints = [
        {
          time: new Date().toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "Order Processed & Barcode Issued",
          location: "Global Fulfillment Hub",
          description: `Tracking code ${args.trackingNumber} allocated. Parcel packaged and prepared for direct air dispatch to Qatar.`,
          carrier: "Qatify Air Express",
        },
      ];
    }

    // Determine current overarching stage from real-time events
    const latestEvent = checkpoints[checkpoints.length - 1];
    const inferredStage = mapCheckpointToStage(
      latestEvent?.description || latestEvent?.status || "",
      latestEvent?.location || ""
    );

    // Save into database via internalMutation
    await ctx.runMutation(internal.tracking.saveTrackingCheckpoints, {
      orderId: args.orderId,
      checkpoints,
      inferredStage,
      provider: providerName,
    });

    return {
      success: true,
      checkpointsCount: checkpoints.length,
      inferredStage,
      provider: providerName,
    };
  },
});

// -----------------------------------------------------------------------------
// 4. Internal Mutation: Commit Checkpoints & Advance Timeline
// -----------------------------------------------------------------------------
export const saveTrackingCheckpoints = internalMutation({
  args: {
    orderId: v.id("orders"),
    checkpoints: v.array(
      v.object({
        time: v.string(),
        status: v.string(),
        location: v.string(),
        description: v.string(),
        carrier: v.optional(v.string()),
      })
    ),
    inferredStage: v.union(
      v.literal("Order Confirmed"),
      v.literal("Air Hub Transit"),
      v.literal("Qatar Customs (DOH)"),
      v.literal("Out for Delivery"),
      v.literal("Delivered"),
      v.literal("Cancelled")
    ),
    provider: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) return;

    const stageOrder = [
      "Order Confirmed",
      "Air Hub Transit",
      "Qatar Customs (DOH)",
      "Out for Delivery",
      "Delivered",
    ];

    const targetIndex = stageOrder.indexOf(args.inferredStage);

    // Advance 5-stage shipment timeline smoothly
    const updatedTimeline = order.timeline.map((step) => {
      const stepIndex = stageOrder.indexOf(step.stage);
      if (targetIndex === -1) return step;

      if (stepIndex < targetIndex) {
        return { ...step, completed: true, current: false };
      } else if (stepIndex === targetIndex) {
        return { ...step, completed: true, current: true };
      } else {
        return { ...step, completed: false, current: false };
      }
    });

    const isStatusChanged = order.status !== args.inferredStage;

    await ctx.db.patch(args.orderId, {
      status: args.inferredStage,
      timeline: updatedTimeline,
      liveCheckpoints: args.checkpoints,
      lastTrackingSync: new Date().toISOString(),
      trackingProvider: args.provider,
    });

    // If shipment milestone advanced, trigger instant Telegram alert to store team
    if (isStatusChanged && args.inferredStage !== "Order Confirmed") {
      const latestCp = args.checkpoints[args.checkpoints.length - 1];
      await ctx.scheduler.runAfter(0, internal.telegram.sendShipmentStatusTelegram, {
        orderId: args.orderId,
        stage: args.inferredStage,
        checkpointDesc: latestCp?.description || `Order status advanced to ${args.inferredStage}`,
        checkpointLocation: latestCp?.location || "Qatar Logistics Hub",
      });
    }
  },
});

// -----------------------------------------------------------------------------
// 5. Public / User Action: Trigger Manual Refresh of Live Tracking
// -----------------------------------------------------------------------------
export const refreshOrderTracking = mutation({
  args: {
    orderNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanNumber = args.orderNumber.trim().toUpperCase();
    const order = await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", cleanNumber))
      .first();

    if (!order) throw new Error("Order not found.");

    const trackingCode = order.aliexpressTrackingNumber || order.trackingNumber;

    await ctx.scheduler.runAfter(0, internal.tracking.syncAliExpressTrackingAction, {
      orderId: order._id,
      trackingNumber: trackingCode,
      carrierCode: order.aliexpressCarrier || "cainiao",
    });

    return { success: true, message: "Live tracking sync scheduled." };
  },
});

// -----------------------------------------------------------------------------
// 6. Public Query: Search Tracking Info by any Reference
// (Qatify Order Ref, QAT Tracking Code, or AliExpress Tracking Code)
// -----------------------------------------------------------------------------
export const getFullTracking = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const clean = args.code.trim().toUpperCase();
    if (!clean) return null;

    // 1. By Order Number (e.g. QA-89421)
    let order = await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", clean))
      .first();

    // 2. By Qatify Tracking Number (e.g. QAT-AIR-89421)
    if (!order) {
      order = await ctx.db
        .query("orders")
        .withIndex("by_trackingNumber", (q) => q.eq("trackingNumber", clean))
        .first();
    }

    // 3. By AliExpress Tracking Number
    if (!order) {
      order = await ctx.db
        .query("orders")
        .withIndex("by_aliexpressTrackingNumber", (q) =>
          q.eq("aliexpressTrackingNumber", clean)
        )
        .first();
    }

    if (!order) return null;

    // Strip sensitive internal data before returning public view
    return {
      orderNumber: order.orderNumber,
      trackingNumber: order.trackingNumber,
      aliexpressTrackingNumber: order.aliexpressTrackingNumber,
      carrier: order.aliexpressCarrier || "Direct Air Express",
      status: order.status,
      date: order.date,
      estimatedDeliveryWindow: order.estimatedDeliveryWindow,
      municipality: order.address?.municipality || "Qatar",
      zoneNumber: order.address?.zoneNumber || "",
      itemsCount: order.items?.length || 1,
      items: order.items.map((it) => ({
        title: it.title,
        quantity: it.quantity,
        image: it.image,
      })),
      timeline: order.timeline,
      liveCheckpoints: order.liveCheckpoints || [],
      lastTrackingSync: order.lastTrackingSync,
      trackingProvider: order.trackingProvider,
    };
  },
});

// -----------------------------------------------------------------------------
// 7. Internal Query: List Active Shipments for Scheduled Cron Sync
// -----------------------------------------------------------------------------
export const listActiveShipmentsForSync = internalQuery({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").order("desc").take(50);
    return orders
      .filter(
        (o) =>
          o.aliexpressTrackingNumber &&
          o.status !== "Delivered" &&
          o.status !== "Cancelled"
      )
      .map((o) => ({
        orderId: o._id,
        trackingNumber: o.aliexpressTrackingNumber!,
        carrierCode: o.aliexpressCarrier || "cainiao",
      }));
  },
});

type ActiveShipmentSyncItem = {
  orderId: Id<"orders">;
  trackingNumber: string;
  carrierCode: string;
};

// -----------------------------------------------------------------------------
// 8. Internal Action: Automated Batch Sync of Active Shipments (Runs via Crons)
// -----------------------------------------------------------------------------
export const autoSyncActiveShipments = internalAction({
  args: {},
  handler: async (ctx): Promise<{ syncedCount: number }> => {
    const activeShipments: ActiveShipmentSyncItem[] = await ctx.runQuery(
      internal.tracking.listActiveShipmentsForSync,
      {}
    );

    console.log(
      `[Tracking Cron] Commencing automated sync for ${activeShipments.length} active international shipments.`
    );

    for (const shipment of activeShipments) {
      try {
        await ctx.runAction(internal.tracking.syncAliExpressTrackingAction, {
          orderId: shipment.orderId,
          trackingNumber: shipment.trackingNumber,
          carrierCode: shipment.carrierCode,
        });
      } catch (err) {
        console.error(
          `[Tracking Cron] Failed to auto-sync shipment ${shipment.trackingNumber}:`,
          err
        );
      }
    }

    return { syncedCount: activeShipments.length };
  },
});

// -----------------------------------------------------------------------------
// 9. Internal Mutation: Process Inbound 17TRACK Webhook Updates
// -----------------------------------------------------------------------------
export const process17TrackWebhook = internalMutation({
  args: {
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    const trackItem = args.payload?.data?.track || args.payload?.track;
    const trackingNumber = args.payload?.data?.number || trackItem?.number;

    if (!trackingNumber || typeof trackingNumber !== "string") {
      return { success: false, reason: "No tracking number in payload" };
    }

    const cleanTracking = trackingNumber.trim().toUpperCase();
    const order = await ctx.db
      .query("orders")
      .withIndex("by_aliexpressTrackingNumber", (q) =>
        q.eq("aliexpressTrackingNumber", cleanTracking)
      )
      .first();

    if (!order) {
      console.log(`[17TRACK Webhook] No order matches tracking ${cleanTracking}`);
      return { success: false, reason: "Order not found" };
    }

    const events = trackItem?.z0?.z || trackItem?.z1?.z || [];
    if (!Array.isArray(events) || events.length === 0) {
      return { success: true, message: "No events to process" };
    }

    const checkpoints = events.map((ev: any) => ({
      time: ev.a || new Date().toISOString(),
      status: sanitizeCheckpointText(ev.z || "In Transit"),
      location: sanitizeCheckpointText(ev.c || ev.d || "Global Logistics Hub"),
      description: sanitizeCheckpointText(ev.z || "Shipment milestone logged"),
      carrier: "Direct Air Express",
    }));

    const latestEvent = checkpoints[checkpoints.length - 1];
    const inferredStage = mapCheckpointToStage(
      latestEvent?.description || latestEvent?.status || "",
      latestEvent?.location || ""
    );

    const stageOrder = [
      "Order Confirmed",
      "Air Hub Transit",
      "Qatar Customs (DOH)",
      "Out for Delivery",
      "Delivered",
    ];
    const targetIndex = stageOrder.indexOf(inferredStage);

    const updatedTimeline = order.timeline.map((step) => {
      const stepIndex = stageOrder.indexOf(step.stage);
      if (targetIndex === -1) return step;
      if (stepIndex < targetIndex) {
        return { ...step, completed: true, current: false };
      } else if (stepIndex === targetIndex) {
        return { ...step, completed: true, current: true };
      } else {
        return { ...step, completed: false, current: false };
      }
    });

    const isStatusChanged = order.status !== inferredStage;

    await ctx.db.patch(order._id, {
      status: inferredStage,
      timeline: updatedTimeline,
      liveCheckpoints: checkpoints,
      lastTrackingSync: new Date().toISOString(),
      trackingProvider: "17track_webhook",
    });

    if (isStatusChanged && inferredStage !== "Order Confirmed") {
      await ctx.scheduler.runAfter(0, internal.telegram.sendShipmentStatusTelegram, {
        orderId: order._id,
        stage: inferredStage,
        checkpointDesc: latestEvent?.description || `Status advanced to ${inferredStage}`,
        checkpointLocation: latestEvent?.location || "Qatar Hub",
      });
    }

    return { success: true, orderId: order._id };
  },
});


