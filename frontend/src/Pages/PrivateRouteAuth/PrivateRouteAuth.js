import React from "react";
import { Outlet } from "react-router-dom";
import { LoadingToRedirects } from "../../Imports/index";
function PrivateRouteAuth({ element: Element, ...rest }) {
  const token = window.localStorage.getItem("userInfo");
  return <>{!token ? <Outlet /> : <LoadingToRedirects />}</>;
}

export default PrivateRouteAuth;
