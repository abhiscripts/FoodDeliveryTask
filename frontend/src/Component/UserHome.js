import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useNavigate } from "react-router-dom";
import { update_auth } from "../Redux/Actions/UserAction";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Filter from "./Filter";
import Cart from "./Cart";
import "../ComponentStyles/UserHome.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [resData, setResData] = useState([]);
  const [filterInfo, setFilterInfo] = useState({});
  const [selectedFilter, setSelectedFilter] = useState({
    name: [],
    place: [],
    cuisine: [],
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [cartData, setCartData] = useState([]);
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

  const getResData = async () => {
    const req = await fetch("http://localhost:3001/apis/resdatas/getResData");
    const resp = await req.json();
    setResData(resp);
    setUniqResInfo(resp);
    setCartData([]);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    populateUserData(token);
    getResData();
  }, []);

  const sortByPrice = () => {
    resData.forEach((res) => {
      res.resDishes.sort(
        (a, b) => parseFloat(a.dishCost) - parseFloat(b.dishCost)
      );
    });
    setResData([...resData]);
  };

  const handleNameFilter = (event) => {
    if (event.target.checked) {
      setSelectedFilter({
        ...selectedFilter,
        name: [...selectedFilter.name, event.target.id],
      });
    } else {
      const updatedNames = selectedFilter.name.filter(
        (item) => item !== event.target.id
      );
      setSelectedFilter({ ...selectedFilter, name: updatedNames });
    }
  };
  const handlePlaceFilter = (event) => {
    if (event.target.checked) {
      setSelectedFilter({
        ...selectedFilter,
        place: [...selectedFilter.place, event.target.id],
      });
    } else {
      const updatedPlace = selectedFilter.place.filter(
        (item) => item !== event.target.id
      );
      setSelectedFilter({ ...selectedFilter, place: updatedPlace });
    }
  };
  const handleCFilter = (event) => {
    if (event.target.checked) {
      setSelectedFilter({
        ...selectedFilter,
        cuisine: [...selectedFilter.cuisine, event.target.id],
      });
    } else {
      const updatedCuisine = selectedFilter.cuisine.filter(
        (item) => item !== event.target.id
      );
      setSelectedFilter({ ...selectedFilter, cuisine: updatedCuisine });
    }
  };

  const filterCloseHandler = () => {
    setFilterVisible(false);
  };

  const cartCloseHandler = () => {
    setCartVisible(false);
  };

  const handleFilter = () => {
    let filteredResData = [];
    if (selectedFilter.name.length) {
      filteredResData = resData.filter((res) =>
        selectedFilter.name.includes(res.resName)
      );
    }
    if (selectedFilter.place.length) {
      if (filteredResData.length) {
        filteredResData = filteredResData.filter((res) =>
          selectedFilter.place.includes(res.resPlace)
        );
      } else {
        filteredResData = resData.filter((res) =>
          selectedFilter.place.includes(res.resPlace)
        );
      }
    }
    if (selectedFilter.cuisine.length) {
      if (filteredResData.length) {
        filteredResData = filteredResData.filter((res) =>
          selectedFilter.cuisine.includes(res.resDishes[0].dishCuisine)
        );
      } else {
        filteredResData = resData.filter((res) =>
          selectedFilter.cuisine.includes(res.resDishes[0].dishCuisine)
        );
      }
    }
    setResData([...filteredResData]);
    setFilterVisible(false);
  };

  const handleCartData = (event) => {
    setCartData([...cartData, JSON.parse(event.target.id)]);
  };

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
                      <button
                        onClick={handleCartData}
                        id={JSON.stringify(dish)}
                      >
                        Add
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        );
      });
    return resComponent;
  };

  const renderFilterUI = () => {
    return (
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
            <Button variant="outlined" onClick={handleFilter}>
              Apply Filter
            </Button>
          </div>
        )}
      </Filter>
    );
  };

  const renderCartUI = () => {
    return (
      <Cart onClose={cartCloseHandler} show={cartVisible} title="My Cart">
        <div>
          <h4>
            {cartData.map((cartItem, id) => {
              return (
                <div key={id}>
                  <h3>{`${cartItem.dishName} - ${cartItem.dishCost}₹ `}</h3>
                </div>
              );
            })}
          </h4>
          <h3>{`${cartData.length} Items Total : ${cartData.reduce(
            (acc, item) => {
              return acc + parseInt(item.dishCost);
            },
            0
          )}`}</h3>
          <Button variant="outlined">Order</Button>
        </div>
      </Cart>
    );
  };

  const renderMenuButtons = () => {
    return (
      <div className="dataOptions">
        <Button variant="outlined" onClick={sortByPrice}>
          Sort-Price
        </Button>
        <Button variant="outlined" onClick={() => setFilterVisible(true)}>
          Filter
        </Button>
        <Button variant="outlined" onClick={() => setCartVisible(true)}>
          {`Cart Item ${cartData.length}`}
        </Button>
        <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          options={resData.map((res) => res.resName)}
          renderInput={(params) => (
            <TextField
              style={{ width: 400 }}
              {...params}
              label="Search Restaurant"
              InputProps={{
                ...params.InputProps,
                type: "search",
              }}
            />
          )}
        />
        <Button variant="outlined" onClick={getResData}>
          Reset
        </Button>
      </div>
    );
  };

  return (
    <div className="userPage">
      <h1>Welcome: {userName}</h1>
      {renderMenuButtons()}
      {renderFilterUI()}
      {renderCartUI()}
      {renderResData()}
    </div>
  );
};

export default Dashboard;
