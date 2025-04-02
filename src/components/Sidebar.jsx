import { useEffect, React } from 'react'
import './Sidebar.css';
import { Link, useLocation, useParams } from 'react-router-dom';

const Sidebar = ({
  onAddFolder,
  folders,
  onDeleteFolder,
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

  const sortedFolders = folders.sort((a, b) => b.modDate - a.modDate)

  return (
    <div className='app-sidebar'>
      <div className='sidebar_start_position'>
        <span>ようこそ、{userName}さん！</span>
        <button className='center' onClick={handleLogout}>ログアウト</button>
      </div>
      <div className='app-sidebar-header'>

        <div className='app-sidebar-nav'>
          {/* <button className='new_post' onClick={onAddFolder}>新規作成</button> */}
          <div className='app-wordlist-not'>
            {sortedFolders.map((folder,index) => (
              <div className='wordlist-note-title'>
                <Link
                  to={`/words/${folder.id}`}
                  className={wordId === folder.id ? 'active' : ''}
                >
                  単語リスト　{index +1}
                </Link>
                <button onClick={() => onDeleteFolder(folder.id)}>削除</button>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar