import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const RoomItem = (props) => {
  const [newRoomName, setNewRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadedRooms, setLoadedRooms] = useState([]);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();


  // const handleNewRoom = () => {F
  //   if (newRoomName.trim() !== "") {
  //     return fetch(
  //       `https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms.json`,
  //       {
  //         method: "POST",
  //         body: JSON.stringify({
  //           name: newRoomName,
  //           creator: props.userName,
  //           id: "",
  //         }),
  //       }
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         fetch(
  //           `https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${data.name}.json`,
  //           {
  //             method: "PATCH",
  //             body: JSON.stringify({ id: data.name }),
  //           }
  //         );
  //       })
  //       .catch((error) => {
  //         console.error("Error creating new room:", error);
  //       });
  //   }
  // };

  useEffect(() => {
    setIsLoading(true);
    fetch("https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms.json")
      .then((response) => response.json())
      .then((data) => {
        const rooms = [];
        for (const key in data) {
          const room = {
            id: key,
            ...data[key],
          };
          rooms.push(room);
        }
        //console.log(rooms);
        setIsLoading(false);
        setLoadedRooms(rooms);
      });
  }, [loadedRooms]);

  const handleChatClick = (id, index) => {
    props.handlerSelectedChat(id);
    props.HandlesetRoomId(id);
    const room = loadedRooms[index];

    // if (room && room.messages) {
    //   const messages = Object.values(room.messages);
    //   const senderArray = messages.map((message) => message.sender);

    //   // Remove duplicates using a loop
    //   const uniqueSenders = [];
    //   senderArray.forEach((sender) => {
    //     if (!uniqueSenders.includes(sender)) {
    //       uniqueSenders.push(sender);
    //     }
    //   });
    //   //console.log("uniqueSenders",uniqueSenders);
    //   props.handleSetParticipants(uniqueSenders);

    // } else {
    //   console.log("No messages available for this room");
    // }
  };

  const canDeleteRoom = (id) => {
    fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${id}.json`)
    .then((response) => response.json())
    .then (data => {
      console.log("hello",data);
      const creator = data.creator;
      console.log(creator,"!==" , props.userName);
      if(creator !== props.userName){
        alert("You are not the creator of this room and cannot delete it.");
        console.log("you are not allow to do fuckup like that");
        
      }
      else{
        deleteRoom(id);
      }
     
    })

  }

  const deleteRoom = (id) => {
    // Delete room
    fetch(
      `https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then(() => {
        // After deleting the room, handle additional actions
        props.handleSetParticipants([]);
  
        // Fetch meetups data
        return fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/meetups.json`);
      })
      .then(response => response.json())
      .then(data => {
        console.log("dataToUpdate",data);
        // Check if data contains a meetup with the given chatRoomId
        const meetupIdToUpdate = Object.keys(data).find(meetupId => data[meetupId].chatRoomId.id === id);
        console.log("meetupIdToUpdate",meetupIdToUpdate);
        if (meetupIdToUpdate) {
          // If a meetup with the chatRoomId is found, update its chatRoomId
          //const updatedMeetupData = { ...data[meetupIdToUpdate], chatRoomId: null };
  
          // Update the meetup with the modified data
          fetch(
            `https://meetup-app-50bbf-default-rtdb.firebaseio.com/meetups/${meetupIdToUpdate}/chatRoomId.json`,
            {
              method: "PATCH",
              body: JSON.stringify({id : ""}),
            }
          );
        }
      })
      .catch((error) => {
        console.error("Error deleting room:", error);
      });
  };
  
  if(loadedRooms.length === 0){
    return (
      <section>
        <h2>Chat Rooms</h2>
        <p>No rooms available</p>
        <p>create one</p>
    </section>
    )
  }

  return (
    <div>
    <h2 style={{ color: loadedRooms ? '#B0C4DE' : '#F8F8FF' }} className="text-center">Chat Rooms</h2>
    <div>
      {loadedRooms ? (
        loadedRooms.map((room, index) => (
          <div key={index}>
            <div className="card w-75" onClick={() => handleChatClick(room.id, index)}>
              <h5 className="card-title">{room.name}</h5>
              <img
                src={room.image}
                alt={room.name}
              />
              <p>{room.creator}</p>
              <p className="text-muted"> Last updated {room.lastUpdated}</p>
            </div>
            <button
              className="btn btn-danger"
              style={{marginLeft :'0px'}}
              onClick={() => canDeleteRoom(room.id)}
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        null
      )}
    </div>
      <div className="new-room-container mt-3">
      {/* <input
        type="text"
        className="form-control"
        placeholder="Enter new room name"
        value={newRoomName}
        onChange={(e) => setNewRoomName(e.target.value)}
      /> */}
        {/* <button className="btn btn-primary mt-2" onClick={() => handleNewRoom()}>
          New Room
        </button> */}
      </div>
    </div>
  );
};

export default RoomItem;
