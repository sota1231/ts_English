import { browserLocalPersistence, setPersistence, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = () => {
  const signInWithGoogle = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  // cssはApp.jsx
  return (
    <div className="login">
      <div className="child">
        <h2>英単語・英文アプリにログイン</h2>
        <button onClick={signInWithGoogle}>
          Googleでログイン
        </button>
      </div>
    </div>
  );
};

export default Login;