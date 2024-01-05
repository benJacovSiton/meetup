import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import classes from "./MainNavigation.module.css";
import FavoritesContext from "../../store/favorites-context";
import 'bootstrap/dist/css/bootstrap.min.css';
import Logout from "../rooms/Logout";


function MainNavigation(props) {
  const favoritesCtx = useContext(FavoritesContext);
  const navigate = useNavigate();

  //console.log("favoritesCtx.favorites",favoritesCtx.favorites);
  return (
    <header className={`${classes.header} ${classes.dark}`}>
      <div className={classes.logo}>Half-Way-Meetup</div>
      <nav>
        <ul>
          <li>
            <Link to="/">All Meetup</Link>
          </li>
          <li>
            <Link to="/new-meetup">New Meetup</Link>
          </li>
          <li>
            <Link to="/rooms">Rooms</Link>
          </li>
          <li>
            <Link to="/favorites">
              Favorites
              <span className={classes.badge}>
                {favoritesCtx.totalUserFavorites}
              </span>
            </Link>
          </li>
          <li onClick={()=>{navigate('/welcome')}}>
           welcome
          </li>
          <li>
          {props.userName}
          </li>
          <Link to='/logout'>
            Logout
          </Link>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;

