import { useEffect, React } from 'react'
import './Sidebar.css';
import { Link, useLocation, useParams } from 'react-router-dom';

const Sidebar = ({
  activeNote, setActiveNote,
  userName, handleLogout,
  setWordId
}) => {

  const location = useLocation(); // パスを取得
  const pathParts = location.pathname.split('/');
  const wordId = pathParts[2]; // インデックスNo2の値を取得

  // 親で設定したuseStateを使ってセット＝親のuseStateが発火して親でも使用が可能になる
  useEffect(() => {
    setWordId(wordId);
  }, [wordId, setWordId]);

  return (
    <div className='app-sidebar'>
      <div className='sidebar_start_position'>
        <span>ようこそ、{userName}さん！</span>
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
                  その他
                </Link>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar