import { Route, Routes } from "react-router-dom";

import AuthenticatedOnly from "routers/middlewares/AuthenticatedOnly";
import GuestRouter from "routers/GuestRouter";
import AppRouter from "routers/AppRouter";
import { NotFoundScreen } from "screens/NotFoundScreen";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<GuestRouter />} />
      <Route
        path="/app/*"
        element={<AuthenticatedOnly component={AppRouter} />}
      />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}

export default App;
