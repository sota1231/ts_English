import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = () => {
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="login">
      <h2>ノートアプリにログイン</h2>
      <button onClick={signInWithGoogle}>
        Googleでログイン
      </button>
    </div>
  );
};

export default Login;