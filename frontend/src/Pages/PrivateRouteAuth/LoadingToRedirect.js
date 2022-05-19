import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PageLoading } from "../../Imports/index";
import { useMyContext } from "../../useContext/GlobalState";
const LoadingToRedirect = () => {
  const [count, setCount] = useState(2);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);
    count === 0 && navigate("/", { replace: true, state: { from: location } });
    count === 0 && toast.warning("Please Login  when you to the WebSite 😵");
    return () => clearInterval(interval);
  }, [count, navigate]);

  return <PageLoading />;
};

export default LoadingToRedirect;
