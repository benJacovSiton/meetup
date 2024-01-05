import { auth, provider } from "./firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Login } from "../Login";

const Logup = (props) => {
  const navigate = useNavigate();
  const isLogup = true;
  props.handleLogup(true);

  const handleEmailSignIn = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      let index = user.email.indexOf('@');
      let name = user.email.substring(0, index);
      console.log('handleEmailSignIn');
      props.handleLogin({ name: name, email: user.email, password: password });
      navigate('/');
    } catch (error) {
      console.error("Error signing in with email and password", error.message);
    }
  };

  return(
    <div>
      <Login isLogup={isLogup} handleEmailSignIn={handleEmailSignIn} />;
  </div>
  )
 
 
};

export default Logup;
