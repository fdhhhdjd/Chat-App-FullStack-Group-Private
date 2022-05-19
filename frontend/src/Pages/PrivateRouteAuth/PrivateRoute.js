import React from "react";
import { Outlet } from "react-router-dom";
import { LoadingToRedirect } from "../../Imports/index";
function PrivateRouter({ element: Element, ...rest }) {
  const token = window.localStorage.getItem("userInfo");
  return <>{token ? <Outlet /> : <LoadingToRedirect />}</>;
}

export default PrivateRouter;
