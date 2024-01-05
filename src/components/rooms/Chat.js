import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { app, getDatabase, ref, push, onValue, off } from './firebase-config';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Chat.css";
import {getAuth} from "firebase/auth";

const Chat = (props) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [creator , setCreator] = useState("");
  const [randomGradient , setRandomGradient] = useState("");
  const [senderGradient,setSenderGradient] = useState("");
  const [hederGradient , setHederGradient] = useState("");
  const [inputGradient,setInputGradient] = useState("");
  const [photoChat , setPhotoChat] = useState("");
  const [titleChat ,setTitleChat] = useState("");
  const navigate = useNavigate();

  const auth = getAuth();
  console.log(auth.currentUser);

  const dynamicHederBackgroundGradients = [
    "backgroundHeder-color1",
    "backgroundHeder-color2",
    "backgroundHeder-color3",
   ];

   const dynamicInputBackgroundGradients = [
    "backgroundInput-color1",
    "backgroundInput-color2",
    "backgroundInput-color3",
   ];

   const dynamicRandomBackgroundGradients = [
    "backgroundRandom-color1",
    "backgroundRandom-color2",
    "backgroundRandom-color3",
   ];

   
   const dynamicSenderBackgroundGradients = [
    "backgroundSender-color1",
    "backgroundSender-color2",
    "backgroundSender-color3",
   ];

   useEffect(() => {
    fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${props.roomId}.json`)
    .then(response => response.json())
    .then(data => {
      setPhotoChat(data?.image || '');
      setTitleChat(data?.title || '');
    })
   })

  useEffect(()=>{
    console.log("propsssss.roooomiddd",props.roomId);
    fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${props.roomId}.json`)
      .then(response => response.json())
      .then(data => {
        // console.log("7777", data?.creator); 
        // console.log("777777",data);
        setCreator(data?.creator); //for null
        const randomIndex1 = Math.floor(Math.random() * dynamicHederBackgroundGradients.length);
        setSenderGradient(dynamicSenderBackgroundGradients[randomIndex1]);
        setRandomGradient(dynamicRandomBackgroundGradients[randomIndex1]);
        setInputGradient(dynamicInputBackgroundGradients[randomIndex1]);
        setHederGradient(dynamicHederBackgroundGradients[randomIndex1]);
      })


  },[])

  useEffect(() => {
    console.log("{props.roomId!!!!", props.roomId);
    fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${props.roomId}/Participants.json`)
      .then(response => response.json())
      .then(data => {
        //console.log("dtaaaaaaaaaa", data);
        const users = [];
        for (const key in data) {
          const user = {
            id: key,
            ...data[key]
          };
          users.push(user);
        }
        setParticipants(users);  // Update the participants state with the array
      });

  }, [messages]);

  useEffect(() => {
    const databaseRef = ref(getDatabase(app), `rooms/${props.roomId}/messages`);

    const handleData = (snapshot) => {
      if (snapshot.val()) {
        setMessages(Object.values(snapshot.val()));
      } else {
        setMessages([]);
      }
    };

    onValue(databaseRef, handleData);

    return () => {
      // Cleanup the event listener when the component unmounts
      off(databaseRef, handleData);
    };
  }, [props.roomId]);

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const currentTime = new Date();
      const formattedTime = `${currentTime.getDate()}/${currentTime.getMonth() + 1}/${currentTime.getFullYear()} ${currentTime.getHours()}:${currentTime.getMinutes()}`;
  
      fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${props.roomId}/messages.json`, {
        method: "POST",
        body: JSON.stringify({
          message: newMessage,
          sender: props.userName,
          time: formattedTime,
          photo: auth.currentUser.photoURL,
        }),
      })
        .then(response => response.json())
        .then(data => {
          fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${props.roomId}/messages/${data.name}.json`, {
            method: "PATCH",
            body: JSON.stringify({ id: data.name }),
          })
            .catch((error) => {
              console.error("Error updating message ID:", error);
            });
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
  
      fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${props.roomId}.json`, {
        method: "PATCH",
        body: JSON.stringify({ lastUpdated: formattedTime }),
      })
        .then(response => response.json())
        .then(() => {
          addParticipant();
          setNewMessage("");
        })
        .catch(error => {
          console.error("Error updating lastUpdated:", error);
        });
    }
  };
  

  const addParticipant = () => {
    const isUsernameExist = participants.some(participant => participant.Participant === props.userName);

    //console.log(isUsernameExist);

    if (!isUsernameExist) {
      fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${props.roomId}/Participants.json`, {
        method: "POST",
        body: JSON.stringify({
          Participant: props.userName,
        }),
      }).then(() => {
        fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${props.roomId}/Participants.json`)
          .then(response => response.json())
          .then(data => {
            console.log("setParticipants(data)", data);
            const users = [];
            for (const key in data) {
              const user = {
                id: key,
                ...data[key]
              };
              users.push(user);
            }
            setParticipants(users);  // Update the participants state with the array
          });
      });
    }
  };

  const deleteMessage = (messageId) => {
    //console.log('delete',message);
   // console.log('delete',messageId);
    fetch(`https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${props.roomId}/messages/${messageId}.json`)
    .then(response => response.json())
    .then((data) => {
      data.sender === props.userName ? deleteMessageId() : console.log("you are not allow to do shit like that");
    }).catch((error) => {
        console.error("Error fetch deleting message:", error);
      });

      const deleteMessageId = () => {
        fetch(
          `https://meetup-app-50bbf-default-rtdb.firebaseio.com/rooms/${props.roomId}/messages/${messageId}.json`,
          {
            method: "DELETE",
          }
        )
          .catch((error) => {
            console.error("Error deleting message:", error);
          });
      }
   
  };

  return (
    <div className="d-flex align-items-start">
      {/* Left side div */}
      <div className="card border-dark col-md-9">
      <div className={`${hederGradient} card-header`} style={{color : 'whitesmoke'}}>Chat Header : {titleChat}</div>
        <div className="card-body text-dark">
          <h5 className="card-title">Chat Title</h5>
          {messages.map((message, index) => (
            <blockquote className="blockquote mb-0" key={index} onClick={() => deleteMessage(message.id)}>
              <div className={props.userName !== message.sender ? `${randomGradient}` : `${senderGradient}`}
                style={props.userName !== message.sender ? { textAlign: 'end' } :  { textAlign: 'start' }}>
                <p style={{ color: props.userName !== message.sender ? 'whitesmoke' : 'black' }}>{message.sender}</p>  
                <p  style={{ color: props.userName !== message.sender ? 'white' : 'black' }}>{message.message}</p>
                <p ><img className="avatar" src={message.photo}></img></p>
                <footer className="blockquote-footer">{message.time}</footer>
              </div>
            </blockquote>
          ))}
          <div className={`${inputGradient} inputContainer`}>
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={handleInputChange}
              className="inputField"
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>
      
      {/* Right side div */}
      <div id={'hello'} className="card col-md-4 offset-md-2" style={{ display: '18rem' }}>
        <img src={photoChat} alt="block club" className="card-img-top" />
        <div className="card-body">
        {participants && participants.length > 0 ? (
          participants.map((participant, index) => (
            <div key={index}>
              {participant.Participant === creator ? <p className="btn btn-outline-success">{participant.Participant}</p> : null}
              {participant.Participant === props.userName && participant.Participant !== creator  ? <p className="btn btn-outline-primary">{participant.Participant}</p> : null }
              { participant.Participant !== creator && participant.Participant !== props.userName ? <p className="btn btn-outline-light">{participant.Participant}</p> : null}
            </div>
          ))
        ) : (
          <p>No participants available</p>
        )}
        </div>
      </div>
    </div>
  );
 };  

export default Chat;
