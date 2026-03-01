import { Navigate, Route, Routes } from "react-router-dom";

import DashboardScreen from "screens/App/DashboardScreen";
import MyOrdersScreen from "screens/App/MyOrdersScreen";
import AdminDashboardScreen from "screens/App/Admin/AdminDashboardScreen";
import AdminProductsScreen from "screens/App/Admin/AdminProductsScreen";
import AdminOrdersScreen from "screens/App/Admin/AdminOrdersScreen";
import AdminOnly from "routers/middlewares/AdminOnly";
import NotFoundScreen from "screens/NotFoundScreen";

const AppRouter = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />

      {/* ── Customer routes ── */}
      <Route path="dashboard" element={<DashboardScreen />} />
      <Route path="orders"    element={<MyOrdersScreen />} />

      {/* ── Admin routes ── */}
      <Route
        path="admin"
        element={
          <AdminOnly>
            <AdminDashboardScreen />
          </AdminOnly>
        }
      />
      <Route
        path="admin/products"
        element={
          <AdminOnly>
            <AdminProductsScreen />
          </AdminOnly>
        }
      />
      <Route
        path="admin/orders"
        element={
          <AdminOnly>
            <AdminOrdersScreen />
          </AdminOnly>
        }
      />

      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
};

export default AppRouter;
