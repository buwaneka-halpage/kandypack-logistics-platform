import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/customer-login.tsx"),
  route("/admin", "routes/login.tsx"),
  
  // Admin Routes
  route("/dashboard", "routes/dashboard.tsx"),
  route("/orders", "routes/order-management.tsx"),
  route("/rail-scheduling", "routes/rail-scheduling.tsx"),
  route("/last-mile", "routes/last-mile.tsx"),
  route("/stores", "routes/stores.tsx"),
  route("/admin-management", "routes/admin.tsx"),
  route("/routers", "routes/routers.tsx"),
  route("/reports", "routes/reports.tsx"),
  route("/logs", "routes/logs.tsx"),

  // Customer Routes with Layout
  layout("components/customer/CustomerLayout.tsx", [
    route("/customer/home", "routes/customer-home.tsx"),
    route("/customer/new-order", "routes/customer-new-order.tsx"),
    route("/customer/track-order", "routes/customer-track-order.tsx"),
    route("/customer/order-history", "routes/customer-order-history.tsx"),
    route("/customer/help-support", "routes/customer-help-support.tsx"),
  ]),
] satisfies RouteConfig;
