import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Automatically sync all active cross-border shipments with carrier milestones every 6 hours
crons.interval(
  "auto-sync-active-shipments",
  { hours: 6 },
  internal.tracking.autoSyncActiveShipments,
  {}
);

export default crons;

