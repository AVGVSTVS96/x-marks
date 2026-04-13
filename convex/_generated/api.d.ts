/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as bookmarks from "../bookmarks.js";
import type * as crons from "../crons.js";
import type * as folders from "../folders.js";
import type * as http from "../http.js";
import type * as lib_compareBookmarks from "../lib/compareBookmarks.js";
import type * as lib_xapi from "../lib/xapi.js";
import type * as notes from "../notes.js";
import type * as sync from "../sync.js";
import type * as syncActions from "../syncActions.js";
import type * as syncStart from "../syncStart.js";
import type * as syncState from "../syncState.js";
import type * as tags from "../tags.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  bookmarks: typeof bookmarks;
  crons: typeof crons;
  folders: typeof folders;
  http: typeof http;
  "lib/compareBookmarks": typeof lib_compareBookmarks;
  "lib/xapi": typeof lib_xapi;
  notes: typeof notes;
  sync: typeof sync;
  syncActions: typeof syncActions;
  syncStart: typeof syncStart;
  syncState: typeof syncState;
  tags: typeof tags;
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
