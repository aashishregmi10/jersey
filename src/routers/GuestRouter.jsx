import { Route, Routes } from "react-router-dom";

import HomeScreen from "screens/Guest/HomeScreen";
import SignInScreen from "screens/Guest/SignInScreen";
import RegisterScreen from "screens/Guest/RegisterScreen";
import ShopScreen from "screens/Guest/ShopScreen";
import ProductDetailScreen from "screens/Guest/ProductDetailScreen";
import CartScreen from "screens/Guest/CartScreen";
import CheckoutScreen from "screens/Guest/CheckoutScreen";
import OrderConfirmationScreen from "screens/Guest/OrderConfirmationScreen";
import NotFoundScreen from "screens/NotFoundScreen";

const GuestRouter = () => {
  return (
    <Routes>
      <Route path="/"                element={<HomeScreen />} />
      <Route path="/sign-in"         element={<SignInScreen />} />
      <Route path="/sign-up"         element={<RegisterScreen />} />
      <Route path="/shop"            element={<ShopScreen />} />
      <Route path="/product/:id"     element={<ProductDetailScreen />} />
      <Route path="/cart"            element={<CartScreen />} />
      <Route path="/checkout"        element={<CheckoutScreen />} />
      <Route path="/order-confirmed" element={<OrderConfirmationScreen />} />
      <Route path="*"                element={<NotFoundScreen />} />
    </Routes>
  );
};

export default GuestRouter;
