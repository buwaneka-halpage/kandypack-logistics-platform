// api/index.js
import { createRequestHandler } from "@react-router/server-runtime";
import * as build from "../build/server/index.js";

export default createRequestHandler(build);
