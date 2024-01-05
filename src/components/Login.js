import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoginSocial from "./rooms/LoginSocial";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth"; // Import updateProfile
import { auth } from "./rooms/firebase-config"; 
import {getAuth} from "firebase/auth";


export const Login = (props) => {
  const emailInputRef = useRef();
  const passwordtRef = useRef();
  const navigate = useNavigate();
  const auth = getAuth();

  // const submitHandler = (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   handleEmailSignIn(data.get("email"), data.get("password"));
  // };

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordtRef.current.value;
    let index = enteredEmail.indexOf('@');
    let name = enteredEmail.substring(0, index);
    if (!enteredEmail || !enteredPassword) {
      console.error("Email and password are required.");
      return;
    }
    
    if (props.isLogup) {
      props.handleEmailSignIn(enteredEmail,enteredPassword);
      // handleSignup(name, enteredEmail, enteredPassword);
      console.log("props.isLogup",props.isLogup);
    } else {
      console.log("props.isLogup",props.isLogup);
      signInEmailPassword(name ,enteredEmail, enteredPassword);
    }
  };


  const signInEmailPassword = async (name, email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
  
      const user = userCredential.user;

      const dynamicPhotosURL = [`https://upload.wikimedia.org/wikipedia/en/c/c5/Donald_Trump_mug_shot.jpg`
      , `https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Walter_White_S5B.png/220px-Walter_White_S5B.png` 
      , `https://upload.wikimedia.org/wikipedia/en/c/c6/Jesse_Pinkman_S5B.png`
      , `https://upload.wikimedia.org/wikipedia/en/4/49/Lalo_Salamanca_S5.png`
      , `https://upload.wikimedia.org/wikipedia/en/3/3d/Nacho_Varga_BCS_S5.png`];

      const randomIndex = Math.floor(Math.random() * dynamicPhotosURL.length);
      console.log(randomIndex);
      const randomURL = dynamicPhotosURL[randomIndex];
      console.log(randomURL);
      
      // Update the user's photo URL in Firebase Authentication
      await updateProfile(user, { photoURL: randomURL });
  
      // Fetch the updated user profile (this is necessary as Firebase Authentication updateProfile doesn't return the updated user)
      const updatedUser = await getAuth().currentUser;
  
      // Modify the userData object with the updated photo URL
      const userData = {
        name: name,
        email: email,
        password: password,
        signinWith: "emailAndPassword",
        photo: updatedUser.photoURL,
      };
  
      // Call props.handleSetUser with the updated userData
      props.handleSetUser(userData);
  
      props.handleLogin(userData.name);
      navigate('/');
    } catch (error) {
      console.error("Error signing in with email and password", error.message);
    }
  };
  
  
  

  const handleSetIsLogup = (status) => {
    console.log(`User logup`, status);
  };

  return (
    <form
        onSubmit={submitHandler}
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '12px',
          marginTop: '100px',
          //backgroundImage: 'url("https://media.istockphoto.com/id/160836693/photo/celebration.jpg?s=612x612&w=0&k=20&c=TEpNxE955P6EOSvL4ULwWVYs6F6ekGr4-7b2Z4CFCCk=")',
          //backgroundSize: 'cover', // You can adjust the background size based on your preference
    
      }}
    >
      <label>
        <img src="https://cdn-icons-png.flaticon.com/128/2170/2170153.png" alt="login"></img>
      </label>
      <div className="mb-3">
        <label style={{color:"white"}} htmlFor="exampleInputEmail1" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          ref={emailInputRef}
        />
        <div style={{color:"white"}} id="emailHelp" className="form-text">
          We'll never share your email with anyone else.
        </div>
      </div>
      <div style={{color:"white"}} className="mb-3">
        <label htmlFor="exampleInputPassword1" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="inputPassword5"
          className="form-control"
          aria-describedby
          ref={passwordtRef}
        />
        <div style={{color:"white"}} id="passwordHelpBlock" className="form-text">
          Your password must be 8-20 characters long
        </div>
        <div>
          {props.isLogup ? <button style={{ right: '50%', left: '50%' }} className="btn btn-primary">signup</button>
           : <button onClick={signInEmailPassword} style={{ right: '50%', left: '50%' }} className="btn btn-primary">Login</button>}
          {/* <button
            style={{ right: '50%', left: '50%' }}
            className="btn btn-primary"
          >
            {props.isLogup ? 'signup' : 'Login'}
          </button> */}
        </div>
      </div>
      <div>
        {props.isLogup ? (
          <p className="alert alert-info" onClick={() => { navigate('/') }}>shit...sign in</p>
        ) : (
          <LoginSocial
            handleLogin={props.handleLogin}
            handleSetIsLogup={handleSetIsLogup}
            handleSetUser = {props.handleSetUser}
            isLogup={props.isLogup}
          />
        )}
      </div>
    </form>
  );
};
