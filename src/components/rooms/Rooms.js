import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";
import RoomItem from "./RoomItem";
import 'bootstrap/dist/css/bootstrap.min.css';

export const Rooms = (props) => {
  const [isChat, setIsChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState('');
  const [roomName,setRoomName] = useState("");
  const [creator, setCreator] = useState('');
  const [updateTime,setUpdateTime] = useState('');
  const [updateUserName , setUpdateUserName] = useState("");
  // const [roomParticipants , setRoomParticipants] = useState("");
  // console.log("props.participants",props.participants);

  //console.log("props.userName",props.userName);
  // setUpdateUserName(props.userName);
  //console.log("props.updateUserName",props.updateUserName);
  const navigate = useNavigate();

  const handlerSelectedChat = (id) => {
    // console.log("props.userName",props.userName);
    // setRoomParticipants(props.userName);
    //console.log("props.userName",props.userName);
     console.log("props.participants",props.participants);
    // setUpdateUserName(props.userName);
    // console.log("props.updateUserName",props.updateUserName);
    console.log("id",id);
    setIsChat(!isChat);
    setSelectedChat(id);
    fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${id}.json`)
    .then(response => response.json())
    .then(data =>{
      //console.log("setRoomName(data.name);",data.name);
      //onsole.log("selectedchat;",selectedChat);
      setRoomName(data.name);
      props.HandlesetRoomId(id);
      //if(props.firstParticipant)addFirstParticipant(id);
      props.setFirstParticipant(false);
      //console.log("setRoomId;",props.roomId);
      navigate(`/chat/${data.name}`);
    })
    //console.log("selectedchat;",selectedChat);
    
  };

  //  const addFirstParticipant = (id) => {
  //       console.log("id",id);
  //       fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${id}/Participants.json`, {
  //         method: "POST",
  //         body: JSON.stringify({
  //           Participant: props.userName,
  //         }),
  //       });
  //     };

  const hadleSetUpdateTime = (time) => {
    console.log("time1 ",time);
    setUpdateTime(time);
    console.log("time2",updateTime);
    
  }

  useEffect(() => {
    fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${props.roomId}.json`)
      .then(response => response.json())
      .then(data => {
        const users = [];
        for (const key in data) {
          const user = {
            id: key,
            ...data[key]
          };
          console.log('user',user);
          users.push(user);
        }

        setCreator(data.creator);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
  }, [selectedChat]);

  return (
      <div>
        <div>
          <RoomItem  selectedChat={selectedChat} handlerSelectedChat={handlerSelectedChat} userName={props.userName} handleNewRoom={props.handleNewRoom} handleDeleteRoom={props.handleDeleteRoom}  updateTime={updateTime} HandlesetRoomId = {props.HandlesetRoomId} handleSetParticipants={props.handleSetParticipants} />
        </div>
        <div className="row">
          {isChat ? <Chat selectedChat={selectedChat} creator={creator} hadleSetUpdateTime={hadleSetUpdateTime} rooms={props.rooms}  /> : null}
        </div>
      </div>
  );
}