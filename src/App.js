import React, { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import AllMeetupPage from './pages/AllMeetups';
import NewMeetupPage from './pages/NewMeetups';
import FavoritesPage from './pages/Favorites';
import Layout from './components/layout/Layout';
import { Rooms } from './components/rooms/Rooms';
import { Login } from './components/Login';
import Logout from './components/rooms/Logout';
import Logup from './components/rooms/Logup';
import Chat from './components/rooms/Chat';
import WelcomePage from './pages/Welcome';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';


function App() {
 const [meetId, setMeetId] = useState('');
  const [rooms, setRooms] = useState(['Room 1', 'Room 2']);
  const [roomId, setRoomId] = useState('-420');
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUserName] = useState('-420');
  const [user, setUser] = useState({});
  const [participants, setParticipants] = useState([]);
  const [firstParticipant, setFirstParticipant] = useState(true);
  const isLogup = false;
  const auth = getAuth();
  

  useEffect(() => {
    // Check if there's a user in local storage on component mount
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      setIsLogin(true);
      setUserName(storedUser.name);
      setUser(storedUser);
    }

    // Set up the Firebase authentication state observer
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const providerId = firebaseUser.providerData[0]?.providerId;
        console.log('User is signed in with provider:', providerId);

        const userData = {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          password: firebaseUser.password,
          signinWith: providerId || 'unknown', // Set to 'unknown' if providerId is not available
        };

        // Save user data to local storage
        localStorage.setItem('user', JSON.stringify(userData));

        setIsLogin(true);
        setUserName(firebaseUser.displayName);
        setUser(userData);
      } else {
        // User is signed out
        console.log('User is signed out');
        setIsLogin(false);
        setUserName('');
        setUser({});
        // Clear user data from local storage
        localStorage.removeItem('user');
      }
    });

    // Clean up the observer when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [auth]);

  const handleNewRoom = (newRoomName) => {
    setRooms([...rooms, newRoomName]);
    console.log('roomname', newRoomName);
    console.log('handleNewRoom', rooms);
  };

  const handleDeleteRoom = (roomList) =>{
    setRooms(roomList);
    //console.log('handleDeleteRoom', rooms);
  }

  const handleLogin = (name) => {
    setIsLogin(true);
    setUserName(name);
    console.log('loginwork', userName);
  };

  const handleLogoutGoogle = async () => {
    setIsLogin(false);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error.message);
    }
    setUserName('');
  };
   

  const handleLogup = (name) => {
    setIsLogin(true);
    //console.log('logupwork', name);
    setUserName(name);
  };

  const handleSetUser = (user) =>{
    console.log('setUserwork', user);
    setUser(user);
  }

  const handleSetParticipants = (ParticipantList) =>{
      setParticipants(ParticipantList);
      console.log(participants);
  }

  const HandlesetRoomId = (newRoomId) => {
    setRoomId(newRoomId);
    //console.log(roomId);
  }

  return (
    <Router>
      {isLogin  ? (
        <Layout isLogin={isLogin} handleLogoutGoogle={handleLogoutGoogle} userName={userName} >
          <Routes>
            <Route path="/" element={<AllMeetupPage handleSetParticipants={handleSetParticipants} userName={userName} deletedRoomId={roomId} user={user} />} />
            <Route path="/welcome" element={<WelcomePage/>} />
            <Route path="/new-meetup" element={<NewMeetupPage userName={userName}  />} />
            <Route
              path="/rooms"
              element={<Rooms userName={userName} handleNewRoom={handleNewRoom} handleDeleteRoom={handleDeleteRoom} handleSetParticipants={handleSetParticipants} participants={participants} HandlesetRoomId={HandlesetRoomId} roomId = {roomId} rooms={rooms} setFirstParticipant={setFirstParticipant} firstParticipant = {firstParticipant} />}
            />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/logout" element={<Logout handleLogoutGoogle={handleLogoutGoogle} user={user} setUserName={setUserName} setIsLogin={setIsLogin} />} />
            <Route path="/chat/:shit" element={<Chat HandlesetRoomId={HandlesetRoomId} roomId={roomId} userName={userName} participants={participants} handleSetParticipants={handleSetParticipants} isLogin={isLogin} />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/" element={<Login isLogup={isLogup} handleLogin={handleLogin} handleLogup={handleLogup} handleSetUser = {handleSetUser} />} />
        </Routes>
      )}
      <Routes>
        <Route path="/logup" element={<Logup handleLogup={handleLogup} handleLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
