import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/dashboard", "routes/dashboard.tsx"),
  route("/orders", "routes/order-management.tsx"),
  route("/rail-scheduling", "routes/rail-scheduling.tsx"),
  route("/last-mile", "routes/last-mile.tsx"),
  route("/stores", "routes/stores.tsx"),
  route("/admin", "routes/admin.tsx"),
  route("/routers", "routes/routers.tsx"),
  route("/reports", "routes/reports.tsx"),
  route("/logs", "routes/logs.tsx"),
] satisfies RouteConfig;
