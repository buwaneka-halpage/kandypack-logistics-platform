import OrderAssignment from "../components/admin/OrderAssignment";
import { ProtectedRoute } from "../components/ProtectedRoute";

export function meta() {
  return [
    { title: "Order Assignment - KandyPack Logistics" },
    { name: "description", content: "Assign orders to warehouses" },
  ];
}

export default function OrderAssignmentRoute() {
  return (
    <ProtectedRoute requiredPermission={{ resource: 'warehouse', action: 'assign' }}>
      <OrderAssignment />
    </ProtectedRoute>
  );
}
