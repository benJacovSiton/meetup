import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

const Logout = (props) => {
  const navigate = useNavigate();
  const auth = getAuth();
  

  const logingout = async () => {
    console.log('logingout',props.user )
    if (props.user.signinWith === "emailAndPassword") {
      await handleLogoutEmailAndPassword();
    } else if (props.user.signinWith === 'google.com') {
      await handleLogoutGoogle();
    }
    else if (props.user.signinWith === 'facebook.com') {
      await handleLogoutFacebook();
    }
    
  };

  const handleLogoutEmailAndPassword = async () => {
    try {
      await auth.signOut();
      props.setIsLogin(false);
      navigate('/'); // Navigate to the root route after logging out
    } catch (error) {
      console.error("Error signing out", error.message);
    }
  };

  const handleLogoutGoogle = async () => {
    try {
      await signOut(auth);
      props.setIsLogin(false);
      navigate('/'); // Navigate to the root route after logging out
    } catch (error) {
      console.error("Error signing out", error.message);
    }
    props.setUserName('');
  };

  const handleLogoutFacebook = async () => {
    try {
      await signOut(auth);
      props.setIsLogin(false);
      navigate('/login'); // Navigate to the root route after logging out
    } catch (error) {
      console.error("Error signing out", error.message);
    }
    props.setUserName('');
  };

  return (
    <div>
      <p style={{color: "#2E8B57"}}>
      Like any good meeting, a stay on our site also comes to an end with the hope of future and happy meetings.
      Halfway meeting team
      </p>
      <button style={{marginTop:"12px"}} onClick={logingout} type="button" class="btn btn-info">Logout</button>
      <div>
      <img style={{width : "22rem" , marginTop:"14px"}} src="https://cdn.shortpixel.ai/spai/q_lossy+ret_img+to_auto/www.annieandre.com/wp-content/uploads/2022/05/holding-hands-saying-goodbye.jpg" alt='bye'/>
      </div>
    </div>
  );
};

export default Logout;


// Logout.js
// import React from 'react';
// import { useNavigate } from "react-router-dom";

// const Logout = (props) => {
//   const navigate = useNavigate();

//   return (
//     <div>
//       <button onClick={() => {props.handleLogoutGoogle(); navigate('/');}}>Logout</button>
//     </div>
//   );
// };

// export default Logout;
