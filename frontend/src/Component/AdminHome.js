import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
//import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";
import { update_auth } from "../Redux/Actions/UserAction";
import "../ComponentStyles/AdminHome.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [resName, setResName] = useState("");
  const [resPlace, setResPlace] = useState("");
  const [resDishes, setResDishes] = useState([]);
  const [dishType, setDishType] = useState("veg");
  const [dishName, setDishName] = useState("");
  const [dishCost, setDishCost] = useState("");
  const [dishCuisine, setDishCuisine] = useState("");
  const dispatch = useDispatch();
  const handleDishTypeChange = (event, newDishType) => {
    setDishType(newDishType);
  };

  const handleAddMenu = () => {
    const repeatedDish = resDishes.length
      ? resDishes.find((dish) => dish.dishName === dishName)
      : false;
    if (repeatedDish) {
      alert("Item Already in the menu");
    } else {
      let dishes = [
        ...resDishes,
        {
          dishName: dishName,
          dishCost: dishCost,
          dishType: dishType,
          dishCuisine: dishCuisine,
        },
      ];
      setResDishes(dishes);
    }
  };

  const addRestaurantData = async () => {
    const response = await fetch(
      "http://localhost:3001/apis/resdatas/addResData",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resName,
          resPlace,
          resDishes,
        }),
      }
    );
    const data = await response.json();
    if (data.status === "ok") {
      alert(`${data.res.resName} restaurant added`);
      setResName("");
      setResPlace("");
      setResDishes([]);
    } else {
      alert(data.error);
    }
  };

  const populateAdminData = async (token) => {
    const req = await fetch("http://localhost:3001/apis/admindatas/adminInfo", {
      headers: {
        "x-access-token": token,
      },
    });
    const data = await req.json();
    console.log("populated data", data);
    if (data.status === "ok") {
      setAdminName(data.admin.adminname);
      dispatch(update_auth(true));
    } else {
      alert(data.error);
      localStorage.removeItem("token");
      dispatch(update_auth(false));
      navigate("/adminlogin");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    populateAdminData(token);
  }, []);

  return (
    <div className="adminHome">
      <h1>Welcome: {adminName}</h1>
      <div className="basicInfo">
        <h3>Basic Info : </h3>
        <TextField
          required
          error={!resName}
          id="outlined-required"
          label="Restaurant Name"
          onChange={(e) => setResName(e.target.value)}
        />
        <TextField
          required
          error={!resPlace}
          id="outlined-required"
          label="Place"
          onChange={(e) => setResPlace(e.target.value)}
        />
      </div>
      <div className="dishInfo">
        <h3>Food Menu Data : </h3>
        <h4>
          Items Added :{" "}
          {resDishes.map(
            (dishes) => ` ${dishes.dishName}: ${dishes.dishCost}₹ , `
          )}
        </h4>
        <TextField
          required
          error={!dishName}
          id="outlined-required"
          label="Name"
          onChange={(e) => setDishName(e.target.value)}
        />
        <br />
        <TextField
          required
          error={!dishCost}
          id="outlined-required"
          type="number"
          label="Cost"
          onChange={(e) => setDishCost(e.target.value)}
        />
        <br />
        <TextField
          required
          error={!dishCuisine}
          id="outlined-required"
          label="Cuisine"
          onChange={(e) => setDishCuisine(e.target.value)}
        />
        <br />
        <ToggleButtonGroup
          color="primary"
          value={dishType}
          exclusive
          onChange={handleDishTypeChange}
        >
          <ToggleButton value="veg">Veg</ToggleButton>
          <ToggleButton value="non veg">Non Veg</ToggleButton>
        </ToggleButtonGroup>
        <br />
        <Button
          style={{ padding: "10px" }}
          variant="outlined"
          onClick={handleAddMenu}
          disabled={!dishName || !dishCost || !dishCuisine}
        >
          Add Menu Item
        </Button>
      </div>
      <br />
      <Button
        variant="outlined"
        onClick={addRestaurantData}
        disabled={!resName || !resPlace || !resDishes.length}
      >
        Add Restaurant Data
      </Button>
    </div>
  );
};

export default Dashboard;
