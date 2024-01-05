import React, { useState } from 'react';
import './Dialog.css'; // You can style the dialog in a separate CSS file
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const Dialog = (props) => {
    const[title , setTitle] = useState("");
    const[newTitle ,setNewTitle] = useState("");
    const[address , setAddress] = useState("");
    const[newAddress ,setNewAddress] = useState("");
    const[img , setImg] = useState("");
    const[newImg ,setNewImg] = useState("");
    const[description , setDescription] = useState("");
    const[newDescription ,setNewDescription] = useState("");
    const[date , setDate] = useState(new Date());
    const[newDate ,setNewDate] = useState("");

    const handleSubmitChanges = () => {
        if(newTitle != "" && newTitle != title){
            setTitle(newTitle);
            handleUpdate("title",newTitle);
        }

         if(newImg != "" && newImg != img){
            setImg(newImg);
            handleUpdate("image",newImg);
        }

        if(newAddress != "" && newAddress != address){
            setAddress(newAddress);
            handleUpdate("address",newAddress);
        }

        if(newDescription != "" && newDescription != description){
            setDescription(newDescription);
            handleUpdate("description",newDescription);

        }

        if(newDate != "" && newDate != date){
            setDate(newDate);
            handleUpdate("date",newDate);

        }

        props.onClose();
    }

    const handleUpdate = (key, value) => {
      fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/meetups/${props.id}.json`, {
        method: "PATCH",
        body: JSON.stringify({ [key]: value }), // Fix: Use square brackets to create a dynamic key
      })
        .then(() => {
          fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/meetups/${props.id}.json`)
            .then(response => response.json())
            .then(data => {
              const meetupId = data.meetupId;
              fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/favorites.json`)
                .then(response => response.json())
                .then(favoritesData => {
                  const favoritesArray = Object.values(favoritesData);
    
                  // Step 2: Scan the array to find an item with the same meetupId
                  const matchingFavorite = favoritesArray.find(favorite => favorite.id === meetupId);
    
                  if (matchingFavorite) {
                    // Step 3: Grab the favoriteId from the matching item
                    const favoriteId = matchingFavorite.favoriteId;
    
                    // Step 4: Fetch the address
                    fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/favorites/${favoriteId}.json`)
                      .then(response => response.json())
                      .then(favoriteData => {
                        // Step 5: Update the title with the new title
                        fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/favorites/${favoriteId}.json`, {
                          method: "PATCH",
                          body: JSON.stringify({ [key]: value }), // Fix: Use newTitle instead of value
                        });
                      });
                  }
                });
            });
        });
    };
    

  return (
    <>
      {props.isOpen && (
        <div className="overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h2>update meetup</h2>
            </div>
            <div>
              <input placeholder='enter new title' onChange={(event)=>{setNewTitle(event.target.value)}} />
              <input placeholder='enter new address' onChange={(event)=>{setNewAddress(event.target.value)}} />
              <input placeholder='enter new pic' onChange={(event)=>{setNewImg(event.target.value)}} />
              <input placeholder='enter new description' onChange={(event)=>{setNewDescription(event.target.value)}} />
              <DatePicker
            selected={date}
            onChange={(date) => setNewDate(date)}
            showTimeSelect
            timeFormat='HH:mm'
            timeIntervals={15}
            dateFormat='MMMM d, yyyy h:mm aa'
          />
            </div>
           <button onClick={handleSubmitChanges}>save</button>
           <button className="close-button" onClick={props.onClose}>
                &times;
              </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Dialog;
