import { useContext, useEffect, useState } from "react";
import FavoritesContext from "../store/favorites-context";
import { app, getDatabase, ref, onValue, off } from '../components/rooms/firebase-config';

function Favorites() {
  const favoritesCtx = useContext(FavoritesContext);

  return (
    <section>
       <h1 style={{ color: "#696969" }}>My Favorites</h1>
      <ul style={{ display: "flex", flexWrap: "wrap", gap: "10px", listStyle: "none", padding: 0 }}>
        {favoritesCtx.userFavorites.map((favorite , index) => (
          <li key={favorite.id}>
            <div className="card" style={{ width: "18rem" , height: "28rem" }}>
              <img src={favorite.image} className="card-img-top" alt="..." style={{height: "14rem"}}></img>
              <div className="card-body">
                <h3 style={{ color: "#008B8B"}}>{favorite.title}</h3>
                <p>{new Date(favorite.date).toLocaleDateString()}</p>
                <p style={{ color: "#2F4F4F" }}>{favorite.address}</p>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => favoritesCtx.removeFavorite(favorite.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Favorites;
