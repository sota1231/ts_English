import React from 'react'
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ onAddNote, notes, onDeleteNote, activeNote, setActiveNote, userName, handleLogout }) => {

    const location = useLocation();
    const sortedNotes = notes.sort((a, b) => b.modDate - a.modDate)

    return (
        <div className='app-sidebar'>
            <div>
                <span>ようこそ、{userName}さん！</span>
                <button className='center' onClick={handleLogout}>ログアウト</button>
            </div>
            <div className='app-sidebar-header'>

                <div className='app-sidebar-nav'>
                    <Link
                        to="/words"
                        className={location.pathname === '/words' ? 'active' : ''}
                    >
                        単語リスト
                    </Link>
                    <Link
                        to="/articles"
                        className={location.pathname === '/articles' ? 'active' : ''}
                    >
                        記事リスト
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Sidebar