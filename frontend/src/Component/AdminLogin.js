import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "../ComponentStyles/Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [adminemail, setAdminEmail] = useState("");
  const [adminpassword, setAdminPass] = useState("");
  const navigate = useNavigate();

  const loginUser = async (event) => {
    event.preventDefault();
    const response = await fetch(
      "http://localhost:3001/apis/userdatas/adminlogin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminemail,
          adminpassword,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
    if (data) {
      //localStorage.setItem("token", data.token);
      alert("Admin Login successful");
      navigate("/adminhome");
    } else {
      alert("Please check your username and password");
    }
  };
  return (
    <div className="Login">
      <h1>Admin Login</h1>
      <TextField
        required
        error={!adminemail}
        id="outlined-required"
        label="Email"
        onChange={(e) => setAdminEmail(e.target.value)}
      />
      <br />
      <TextField
        id="outlined-password-input"
        error={!adminpassword}
        label="Password"
        type="password"
        autoComplete="password"
        onChange={(e) => setAdminPass(e.target.value)}
      />
      <br />
      <br />
      <Button
        variant="outlined"
        onClick={loginUser}
        disabled={!adminemail || !adminpassword}
      >
        Login
      </Button>
    </div>
  );
}
