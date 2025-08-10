import React, { useEffect } from 'react'
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';
import { SidebarPropsType } from '../type';

const Sidebar: React.FC<SidebarPropsType> = ({
  handleLogout, 
  setWordId, 
  isOpen, 
  setIsOpen
}) => {
  
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const wordId = pathParts[2];

  useEffect(() => {
    setWordId(wordId);
  }, [wordId, setWordId]);

  return (
    <div className={`app-sidebar ${isOpen ? 'active' : ''}`}>
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
              onClick={() => setIsOpen(false)}
            >
              注文
            </Link>

            <Link
              to="/words/2"
              className={wordId === '2' ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              交通
            </Link>

            <Link
              to="/words/3"
              className={wordId === '3' ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              旅行先会話
            </Link>

            <Link
              to="/words/4"
              className={wordId === '4' ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              映画
            </Link>

            <Link
              to="/words/5"
              className={wordId === '5' ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              単語・短文
            </Link>

            <Link
              to="/words/6"
              className={wordId === '6' ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              英会話
            </Link>

          </div>
        </div>
        <Link
          to="/listening"
          className={location.pathname === '/listening' ? 'active' : ''}
          onClick={() => setIsOpen(false)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
          リスニング問題
        </Link>
        <Link
          to="/voice-settings"
          className={location.pathname === '/voice-settings' ? 'active' : ''}
          onClick={() => setIsOpen(false)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
          音声設定
        </Link>
      </div>
    </div>
  )
}

export default Sidebar