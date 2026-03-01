import { Route, Routes } from "react-router-dom";

import HomeScreen from "screens/Guest/HomeScreen";
import SignInScreen from "screens/Guest/SignInScreen";
import RegisterScreen from "screens/Guest/RegisterScreen";
import { NotFoundScreen } from "screens/NotFoundScreen";

const GuestRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/sign-in" element={<SignInScreen />} />
      <Route path="/sign-up" element={<RegisterScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
};

export default GuestRouter;
