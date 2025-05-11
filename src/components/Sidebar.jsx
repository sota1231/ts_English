import { useEffect, React } from 'react'
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({
  activeNote, setActiveNote,
  userName, handleLogout,
  display,
  setWordId
}) => {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const wordId = pathParts[2];

  useEffect(() => {
    setWordId(wordId);
  }, [wordId, setWordId]);

  return (
    <div className='app-sidebar'>
      <div className='sidebar_start_position'>
        {/* <span>ログインユーザー：{userName}</span> */}
        <span></span>
        <button className='center' onClick={handleLogout}>ログアウト</button>
      </div>
      <div className='app-sidebar-header'>
        <div className='app-sidebar-nav'>
          <div className='app-wordlist-not'>
            <Link
              to="/words/1"
              className={wordId === '1' ? 'active' : ''}
            >
              日常会話　1
            </Link>

            <Link
              to="/words/2"
              className={wordId === '2' ? 'active' : ''}
            >
              日常会話　2
            </Link>

            <Link
              to="/words/3"
              className={wordId === '3' ? 'active' : ''}
            >
              旅行先
            </Link>

            <Link
              to="/words/4"
              className={wordId === '4' ? 'active' : ''}
            >
              映画
            </Link>

            <Link
              to="/words/5"
              className={wordId === '5' ? 'active' : ''}
            >
              単語・短文
            </Link>

            <Link
              to="/words/6"
              className={wordId === '6' ? 'active' : ''}
            >
              その他
            </Link>
          </div>
        </div>
        <Link
          to="/listening"
          className={location.pathname === '/listening' ? 'active' : ''}
        >
          リスニング問題
        </Link>
        <Link
          to="/voice-settings"
          className={location.pathname === '/voice-settings' ? 'active' : ''}
        >
          音声設定
        </Link>
        <div className='advice'>
          <span>聞き取れない原因は２つ</span><br></br>
          ①知らない単語・短文　→　短文を覚える<br></br>
          ②正しい発音を知らない　→　リンキング、シャドーイング<br></br>
          <br></br>
          またリスニングには<br></br>
          音声知覚（聴こえた音）<br></br>
          意味理解（文を塊で理解,声色,話の流れ）<br></br>
          がある。<br></br>
        </div>

        <div className='advice english_brain'>
          <span>スムーズな会話には英語脳が必須</span><br></br>
          ①日本語から英語を作るステップをする<br></br>
          ②ある程度できるようになったら①の日本語と英語で紐づけず<br></br>
          イメージと英語で紐づけをする<br></br>
        </div>
      </div>
    </div>
  )
}

export default Sidebar