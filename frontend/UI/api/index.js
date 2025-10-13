import { createRequestHandler } from "@react-router/node";
import * as build from "../build/server/index.js";

// Export the handler for Vercel serverless function
export default createRequestHandler({
  build,
  mode: process.env.NODE_ENV || "production",
});