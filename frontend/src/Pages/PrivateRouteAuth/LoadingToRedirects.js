import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PageLoading } from "../../Imports/index";
const LoadingToRedirects = () => {
  const [count, setCount] = useState(2);
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    setUser(user);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);
    count === 0 &&
      navigate("/chats", { replace: true, state: { from: location } });
    count === 0 && toast.info(`Please Logout Account ${user?.name} 🤔`);
    return () => clearInterval(interval);
  }, [count, navigate, user]);

  return <PageLoading />;
};

export default LoadingToRedirects;
