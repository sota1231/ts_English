import React from 'react'
import './Wordlist.css';

const Wordlist = ({ onAddNote, notes, onDeleteNote, activeNote, setActiveNote, userName, handleLogout, onUpdateCheckbox, onUpdateNote }) => {

    const sortedNotes = notes.sort((a, b) => b.createDate - a.createDate)

    return (
        <div className='app-wordlist'>
            <div className='app-wordlist-header'>
                <h1>リスト</h1>
                <button onClick={onAddNote}>新規作成</button>
            </div>
            <div className='app-wordlist-notes'>
                {sortedNotes.map((note) => (
                    <div
                        className={`app-wordlist-note ${note.id === activeNote && "active"}`}
                        key={note.id}
                        onClick={() => setActiveNote(note.id)}
                    >
                        <input
                            type="checkbox"
                            checked={note.remenber}
                            onChange={(e) => onUpdateCheckbox(note.id, e.target.checked)}
                        />
                        <div className='title_deleteButton'>
                            <div className='wordlist-note-title'>
                                <strong>{(note.english ? note.english : 'クリックしてください')}</strong>
                                <button onClick={() => onDeleteNote(note.id)}>削除</button>
                            </div>
                            {note.japanese && (
                                <p>{note.japanese}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Wordlist