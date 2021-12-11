import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

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
    } else {
      alert(data.error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    populateUserData(token);
    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, []);

  return (
    <div>
      <h1>Welcome: {userName}</h1>
      {/* <button onClick={populateUserData}>Populate</button> */}
    </div>
  );
};

export default Dashboard;
