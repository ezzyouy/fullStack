import React, { useContext } from "react";
import { Store } from "../Store";
import { Navigate } from "react-router-dom";

function SellerRoute({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo && userInfo.isSeller ? children : <Navigate to="/signin" />;
}

export default SellerRoute;
