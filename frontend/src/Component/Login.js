import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "../ComponentStyles/Login.css";
import {update_auth} from "../Redux/Actions/UserAction"


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginUser = async (event) => {
    event.preventDefault();
    const response = await fetch("http://localhost:3001/apis/userdatas/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    console.log("login data", data);
    if (data.status != "fail") {
      localStorage.setItem("token", data.token);
      dispatch(update_auth(true));
      navigate("/userhome");
    } else {
      //alert("Please check your username and password");
      alert(data.msg);
    }
  };
  return (
    <div className="Login">
      <h1>User Login</h1>
      <TextField
        required
        error={!email}
        id="outlined-required"
        label="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <TextField
        id="outlined-password-input"
        error={!password}
        label="Password"
        type="password"
        autoComplete="password"
        onChange={(e) => setPass(e.target.value)}
      />
      <br />
      <br />
      <Button
        variant="outlined"
        onClick={loginUser}
        disabled={!email || !password}
      >
        Login
      </Button>
    </div>
  );
}
