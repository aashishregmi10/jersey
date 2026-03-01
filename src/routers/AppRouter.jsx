import { Navigate, Route, Routes } from "react-router-dom";

import DashboardScreen from "screens/App/DashboardScreen";
import { NotFoundScreen } from "screens/NotFoundScreen";

const AppRouter = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<DashboardScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
};

export default AppRouter;
