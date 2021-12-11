import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import classes from "../ComponentStyles/MainHeader.module.css";
import {update_auth} from "../Redux/Actions/UserAction"

const MainHeader = () => {
  const isAuth = useSelector((state) => state.userData.isAuthenticated);
  const dispatch = useDispatch();
  const handleLogout = (e) => {
    localStorage.removeItem("token");
    dispatch(update_auth(false))
  }
  return (
    <header className={classes.header}>
      <nav>
        {isAuth ? (
          <ul>
            <li>
              <NavLink className={classes.active} to="/login" onClick={e => handleLogout(e)}>
                Logout
              </NavLink>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <NavLink className={classes.active} to="/login">
                User Login
              </NavLink>
            </li>
            <li>
              <NavLink className={classes.active} to="/signup">
                SignUp
              </NavLink>
            </li>
            <li>
              <NavLink className={classes.active} to="/adminlogin">
                Admin Login
              </NavLink>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default MainHeader;
