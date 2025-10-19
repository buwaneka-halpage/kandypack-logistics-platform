import WarehouseOrders from "../components/warehouse/WarehouseOrders";
import { ProtectedRoute } from "../components/ProtectedRoute";

export function meta() {
  return [
    { title: "Warehouse Orders - KandyPack Logistics" },
    { name: "description", content: "View and manage warehouse orders" },
  ];
}

export default function WarehouseOrdersRoute() {
  return (
    <ProtectedRoute requiredPermission={{ resource: 'order', action: 'read' }}>
      <WarehouseOrders />
    </ProtectedRoute>
  );
}
