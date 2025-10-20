import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route("/login", "routes/customer-login.tsx"),
  route("/signup", "routes/customer-signup.tsx"),
  route("/admin", "routes/login.tsx"),
  
  // Admin Routes (with /admin prefix)
  route("/admin/dashboard", "routes/dashboard.tsx"),
  route("/admin/orders", "routes/order-management.tsx"),
  route("/admin/rail-scheduling", "routes/rail-scheduling.tsx"),
  route("/admin/last-mile", "routes/last-mile.tsx"),
  route("/admin/stores", "routes/stores.tsx"),
  route("/admin/admin-management", "routes/admin.tsx"),
  route("/admin/routers", "routes/routers.tsx"),
  route("/admin/reports", "routes/reports.tsx"),
  route("/admin/logs", "routes/logs.tsx"),

  // Customer Routes with Layout
  layout("components/customer/CustomerLayout.tsx", [
    route("/customer/home", "routes/customer-home.tsx"),
    route("/customer/new-order", "routes/customer-new-order.tsx"),
    route("/customer/track-order", "routes/customer-track-order.tsx"),
    route("/customer/order-history", "routes/customer-order-history.tsx"),
    route("/customer/help-support", "routes/customer-help-support.tsx"),
  ]),
] satisfies RouteConfig;
