import { browserLocalPersistence, setPersistence, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = () => {
  const signInWithGoogle = async (): Promise<void> => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, provider).then((result) => {
        // ログイン成功
        console.log("ログイン成功:", result.user);
      })
      .catch((error) => {
        // エラー処理
        console.error("ログインエラー:", error);
      });
    } catch (error: unknown) {
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