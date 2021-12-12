import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
//import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";
import { update_auth } from "../Redux/Actions/UserAction";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const dispatch = useDispatch();

  const populateUserData = async (token) => {
    const req = await fetch("http://localhost:3001/apis/userdatas/userInfo", {
      headers: {
        "x-access-token": token,
      },
    });
    const data = await req.json();
    console.log("populated data", data);
    if (data.status === "ok") {
      setUserName(data.user.name);
      dispatch(update_auth(true));
    } else {
      alert(data.error);
      localStorage.removeItem("token");
      dispatch(update_auth(false));
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    populateUserData(token);
  }, []);

  return (
    <div>
      <h1>Welcome: {userName}</h1>
      {/* <button onClick={populateUserData}>Populate</button> */}
    </div>
  );
};

export default Dashboard;
