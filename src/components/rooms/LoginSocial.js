import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaFacebook } from "react-icons/fa";

const LoginSocial = (props) => {

  props.handleSetIsLogup(false);

  const navigate = useNavigate();
  const auth = getAuth();

  // Function to handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error.message);
    }
    
  };

  const handleFacebookSignIn = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Facebook", error.message);
    }
  };

  // useEffect to check user authentication status on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const providerId = user.providerData[0]?.providerId;
        console.log("User is signed in with provider:", providerId);
  
        props.handleLogin(user.displayName);
        props.handleSetUser({
          name: user.displayName,
          email: user.email,
          password: user.password,
          signinWith: providerId || 'unknown', // Set to 'unknown' if providerId is not available
        });
  
        navigate("/");
      } else {
        // User is signed out
        console.log("User is signed out");
      }
    });
  
    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [auth, navigate, props]);

  return (
    <div>
       <FaGoogle style={{color : "white" , margin : '2rem' , marginTop:'10px'}} onClick={handleGoogleSignIn} size={35} />
       <FaFacebook style={{color : "white" , margin : '2rem' , marginTop:'10px'}} size={35} onClick={handleFacebookSignIn} />
       <MdEmail style={{color : "white" , margin : '2rem' , marginTop:'10px'}}
          onClick={() => {
            navigate("logup");
          }}
          handleLogin={props.handleLogin}
          handleSetIsLogup={props.handleSetIsLogup}
          size={35}
        />
    </div>
  );
};
export default LoginSocial;

