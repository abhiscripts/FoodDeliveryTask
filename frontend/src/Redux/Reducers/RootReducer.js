import { combineReducers } from "redux";
import { userReducer } from "./UserReducer";
const RootReducer = combineReducers({ userData: userReducer });
export default RootReducer;
