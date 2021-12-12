import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
//import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";
import { update_auth } from "../Redux/Actions/UserAction";
import Button from "@mui/material/Button";
import Filter from "./Filter";
import "../ComponentStyles/UserHome.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [resData, setResData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [testData, setTestData] = useState([]);
  const [filterInfo, setFilterInfo] = useState({});
  const [filterName, setFilterName] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const dispatch = useDispatch();

  const populateUserData = async (token) => {
    const req = await fetch("http://localhost:3001/apis/userdatas/userInfo", {
      headers: {
        "x-access-token": token,
      },
    });
    const data = await req.json();
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

  const setUniqResInfo = (resp) => {
    const nameSet = new Set();
    const placeSet = new Set();
    const cuisineSet = new Set();
    resp &&
      resp.forEach((res) => {
        nameSet.add(res.resName);
        placeSet.add(res.resPlace);
        res.resDishes.forEach((dish) => cuisineSet.add(dish.dishCuisine));
      });

    setFilterInfo({
      nameSet: Array.from(nameSet),
      placeSet: Array.from(placeSet),
      cuisineSet: Array.from(cuisineSet),
    });
  };
  console.log("finfo", filterInfo);
  const getResData = async () => {
    const req = await fetch("http://localhost:3001/apis/resdatas/getResData");
    const resp = await req.json();
    setResData(resp);
    setUniqResInfo(resp);
    console.log("populated data", resp);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    populateUserData(token);
    getResData();
  }, []);

  useEffect(() => {
    // let nameFilteredData = resData.reduce((acc, res) => {
    //   if (filterName.includes(res.resName)) {
    //     acc.push(res);
    //   }
    //   return acc;
    // }, []);

    //let nameFilteredData = [];
    // filterName.forEach((name) => {
    //   const matchedObj = resData.filter((res) => res.resName === name);
    //   console.log("m  effect", matchedObj);
    //   nameFilteredData.push(matchedObj);
    // });
    // nameFilteredData.length && setResData(nameFilteredData);
    // console.log("effect", filterName, "--", nameFilteredData, resData);
  }, [filterName]);

  const renderResData = () => {
    const resComponent =
      resData.length &&
      resData.map((res, id) => {
        return (
          <div>
            <h2>Restaurant : {`${res.resName} - ${res.resPlace}`}</h2>
            <div key={id} className="resInfo">
              {res.resDishes &&
                res.resDishes.map((dish, index) => {
                  return (
                    <div key={dish.dishName} className="dishInfo">
                      <h3 className="itemStyle">Item : {dish.dishName}</h3>
                      <h3 className="itemStyle">{dish.dishType}</h3>
                      <h3 className="itemStyle">Cuisine: {dish.dishCuisine}</h3>
                      <h3 className="itemStyle">Cost: {`${dish.dishCost}₹`}</h3>
                      <button>Add</button>
                    </div>
                  );
                })}
            </div>
          </div>
        );
      });
    return resComponent;
  };

  const sortByPrice = () => {
    resData.forEach((res) => {
      res.resDishes.sort(
        (a, b) => parseFloat(a.dishCost) - parseFloat(b.dishCost)
      );
    });
    setResData(resData);
    setTestData([1]);
    console.log("sorted", resData);
  };

  const handleNameFilter = (event) => {
    // let fileredByName = []
    if (event.target.checked) {
      setFilterName([...filterName, event.target.id]);
      //fileredByName.push(resData.filter(res => res.resName === event.target.id));
    } else {
      //fileredByName.pop(resData.filter(res => res.resName === event.target.id));
    }
  };
  const handlePlaceFilter = (event) => {
    console.log("cb event", event.target.id);
  };
  const handleCFilter = (event) => {
    console.log("cb event", event.target.id);
  };

  const filterCloseHandler = () => {
    setFilterVisible(false);
  };
  return (
    <div className="userPage">
      <h1>Welcome: {userName}</h1>
      <div className="dataOptions">
        <Button variant="outlined" onClick={sortByPrice}>
          Sort-Price
        </Button>
        <Button variant="outlined" onClick={() => setFilterVisible(true)}>
          Filter
        </Button>
        <Button variant="outlined" onClick={getResData}>
          Reset
        </Button>
      </div>
      <Filter
        onClose={filterCloseHandler}
        show={filterVisible}
        title="Select Filters"
      >
        {Object.keys(filterInfo).length !== 0 && (
          <div>
            <h3>Restaurant Name: </h3>
            {filterInfo.nameSet.map((name) => (
              <FormControlLabel
                control={<Checkbox onChange={handleNameFilter} id={name} />}
                label={name}
              />
            ))}
            <h3>Place: </h3>
            {filterInfo.placeSet.map((place) => (
              <FormControlLabel
                control={<Checkbox onChange={handlePlaceFilter} id={place} />}
                label={place}
              />
            ))}
            <h3>Cuisine: </h3>
            {filterInfo.cuisineSet.map((cuisine) => (
              <FormControlLabel
                control={<Checkbox onChange={handleCFilter} id={cuisine} />}
                label={cuisine}
              />
            ))}
            {/* <Button variant="outlined">Apply Filter</Button> */}
          </div>
        )}
      </Filter>
      {renderResData()}
      {/* <button onClick={populateUserData}>Populate</button> */}
    </div>
  );
};

export default Dashboard;
