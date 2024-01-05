// RoomsList.js
import React, { useState , useEffect } from 'react';
import RoomItem from './RoomItem';

const AllRoomList = () => {
    const [isLoading , setIsLoading] = useState(true);
    const [loadedRooms , setLoadedRooms] = useState([]);
  
    useEffect(() => {
      setIsLoading(true);
      fetch(
        'https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms.json'
      ).then (response => {
        return response.json();
      }).then(data => {
  
        const rooms = [];
  
        for(const key in data){
          const room = {
            id : key ,
            ...data[key]
          };
          rooms.push(room);
        }
        setIsLoading(false);
        setLoadedRooms(rooms);
      });
    } , []);

    if(isLoading){
        return (
          <section>
            <h2>Loading...</h2>
          </section>
        )
      }
    
        return <section>
            <h1>All Chats</h1>
            <RoomItem loadedRooms = {loadedRooms} setLoadedRooms = {setLoadedRooms} />
        </section>
};

export default AllRoomList;
