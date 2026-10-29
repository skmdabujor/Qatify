/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminAuth from "../adminAuth.js";
import type * as admins from "../admins.js";
import type * as auth from "../auth.js";
import type * as bundleProducts from "../bundleProducts.js";
import type * as categories from "../categories.js";
import type * as coupons from "../coupons.js";
import type * as crons from "../crons.js";
import type * as emails from "../emails.js";
import type * as http from "../http.js";
import type * as inquiries from "../inquiries.js";
import type * as newsletter from "../newsletter.js";
import type * as orders from "../orders.js";
import type * as polar from "../polar.js";
import type * as products from "../products.js";
import type * as reviews from "../reviews.js";
import type * as telegram from "../telegram.js";
import type * as tracking from "../tracking.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminAuth: typeof adminAuth;
  admins: typeof admins;
  auth: typeof auth;
  bundleProducts: typeof bundleProducts;
  categories: typeof categories;
  coupons: typeof coupons;
  crons: typeof crons;
  emails: typeof emails;
  http: typeof http;
  inquiries: typeof inquiries;
  newsletter: typeof newsletter;
  orders: typeof orders;
  polar: typeof polar;
  products: typeof products;
  reviews: typeof reviews;
  telegram: typeof telegram;
  tracking: typeof tracking;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
