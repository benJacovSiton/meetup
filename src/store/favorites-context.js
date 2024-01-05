import { createContext, useState ,useEffect } from 'react';
import { getAuth, signOut } from "firebase/auth";
import firebase from 'firebase/app';  // Import firebase object
import 'firebase/database';  // Import the specific module for database
import { app, getDatabase, ref, onValue, off } from './../components/rooms/firebase-config';

const FavoritesContext = createContext({
    favorites: [],
    userFavorites: [],
    totalFavorites: 0,
    totalUserFavorites: 0,
    addFavorite: (favoriteMeetup) => { },
    removeFavorite: (favorites) => { },
    itemIsFavorite: (favoriteMeetupId) => { }
});

export function FavoritesContextProvider(props) {
    const [allFavorites, setAllFavorites] = useState([]);
    const [userFavorites, setUserFavorites] = useState([]);
    const auth = getAuth();
      // Get the user's email
      const userEmail = auth.currentUser ? auth.currentUser.email : null;
      //console.log("User email:", userEmail);

        useEffect(() => {
        // Fetch all favorites
        fetch('https://meetup-app-50bbf-default-rtdb.firebaseio.com/favorites.json')
            .then(response => response.json())
            .then(data => {
                if (data) {
                    const allFavoritesArray = Object.values(data);

                    // Set all favorites
                    setAllFavorites(allFavoritesArray);

                    // Filter user favorites based on userEmail
                    const userFavoritesArray = allFavoritesArray.filter(favorite => favorite.email === userEmail);
                    setUserFavorites(userFavoritesArray);
                } else {
                    setAllFavorites([]);
                    setUserFavorites([]);
                }
            })
            .catch(error => {
                console.error('Error fetching favorites:', error);
            });
    }, [allFavorites]);

    useEffect(() => {
        const databaseRef = ref(getDatabase(app), `favorites`);
    
        const handleData = (snapshot) => {
          if (snapshot.val()) {
            console.log("snapshot.val()",snapshot.val());
            setAllFavorites(Object.values(snapshot.val()));
            // console.log("allFavorites",allFavorites);
            // console.log("allFavorites[allFavorites.length -1]",allFavorites[allFavorites.length -1]);
            // const userC = allFavorites[allFavorites.length -1];
            // console.log("MMMMMMMMM",userC);
            // const email = userC.email;
            // console.log("MMMMMMMMM",email);
            // console.log("allFavorites[allFavorites.length -1]",allFavorites[allFavorites.length -1].email);

            // if(allFavorites[allFavorites.length -1].email === userEmail){
            //     setUserFavorites(Object.values(snapshot.val()));
            // }
          } else {
            setAllFavorites([]);
            setUserFavorites([]);
          }
        };
    
        onValue(databaseRef, handleData);
    
        return () => {
          // Cleanup the event listener when the component unmounts
          off(databaseRef, handleData);
        };
      }, [userEmail]);
    
        // function addFavoriteHandler(favoriteMeetup) {
    //     fetch('https://meetup-app-50bbf-default-rtdb.firebaseio.com/favorites.json', {
    //         method: 'POST',
    //         body: JSON.stringify(favoriteMeetup),
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             // console.log(data);
    //             // console.log(data.name);
    //             fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/favorites/${data.name}.json`, {
    //                 method: 'PATCH',
    //                 body: JSON.stringify({favoriteId : data.name}),
    //             }).then(response => response.json())
    //               .then(data => {
    //                 console.log(data);
    //                 console.log(data.name);
    //                 console.log(data.favoriteId);
    //                 fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/favorites/${data.name}.json`)
    //                 .then(response => response.json())
    //                 .then(data => {
    //                     //const id = data.name;
    //                     console.log(data);
    //                     console.log(data.id);
    //                     // fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/meetups/${data.id}.json`),
    //                     // {
    //                     //     method: 'POST',
    //                     //     body: JSON.stringify({favoriteId : data.name}),
    //                     // }
    //                 })
    //                 setAllFavorites(prevAllFavorites => {
    //                     return [...prevAllFavorites];
    //                 });
    //               })
               
    //         })
          
    // }

    
    function addFavoriteHandler(favoriteMeetup) {
        fetch('https://meetup-app-50bbf-default-rtdb.firebaseio.com/favorites.json', {
            method: 'POST',
            body: JSON.stringify(favoriteMeetup),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log(data.name);
                fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/favorites/${data.name}.json`, {
                    method: 'PATCH',
                    body: JSON.stringify({favoriteId : data.name}),
                })
                setAllFavorites(prevAllFavorites => {
                    return [...prevAllFavorites];
                });
            });
    }

    function removeFavoriteHandler(favoriteMeetupId) {
        // Fetch to get all favorites from Firebase
        fetch('https://meetup-app-50bbf-default-rtdb.firebaseio.com/favorites.json')
            .then(response => response.json())
            .then(data => {
                // Find the key (Firebase ID) of the meetup with the specified ID
                const meetupKey = Object.keys(data).find(key => data[key].id === favoriteMeetupId);
                const meetupKeys = Object.keys(data).filter(key => data[key].id === favoriteMeetupId);

                if (!meetupKey) {
                    console.error('Meetup not found in Firebase');
                    return;
                }

                if (!meetupKeys) {
                    console.error('MeetupS EMPRTY!!!!');
                    return;
                }

                console.log("meetupKeys!!!!!!!!!!!",meetupKeys);
    
                // Fetch to delete the meetup from Firebase using the key
                return fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/favorites/${meetupKey}.json`, {
                    method: 'DELETE',
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete favorite meetup from Firebase');
                }
                // Update the local state only if the deletion from Firebase was successful
                setUserFavorites(prevAllFavorites => {
                    return prevAllFavorites.filter(favoriteMeetup => favoriteMeetup.id !== favoriteMeetupId);
                });
            })
            .catch(error => {
                console.error('Error deleting favorite meetup:', error);
            });
    }
    

    function itemIsFavoriteHandler(meetupId) {
        // צריך לתכנת ולתכנן מחדש שיחזיר רק את הפייבורטיס של משתמש 
        return userFavorites.some(meetup => meetup.id === meetupId);
    }

    const context = {
        favorites: allFavorites,
        totalFavorites: allFavorites.length,
        userFavorites: userFavorites,
        totalUserFavorites: userFavorites.length,
        addFavorite: addFavoriteHandler,
        removeFavorite: removeFavoriteHandler,
        itemIsFavorite: itemIsFavoriteHandler
    };

    return (
        <FavoritesContext.Provider value={context}>
            {props.children}
        </FavoritesContext.Provider>
    );
}

export default FavoritesContext;
