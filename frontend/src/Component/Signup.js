import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "../ComponentStyles/SignUp.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const navigate = useNavigate();

  const registerUser = async () => {
    const response = await fetch(
      "http://localhost:3001/apis/userdatas/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );
    const data = await response.json();
    if (data.status === "ok") {
      navigate("/login");
      alert(`${data.user.name} successfully registered`);
    }
  };

  return (
    <div className="SignUp">
      <h1>SignUp</h1>
      {/* <Stack direction="row" spacing={2}> */}
      <TextField
        required
        error={!name}
        id="outlined-required"
        label="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <br />
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
        onClick={registerUser}
        disabled={!name || !email || !password}
      >
        SignUp
      </Button>
      {/* </Stack> */}
    </div>
  );
}
