import './App.css'
import Sidebar from './components/Sidebar'
import InputField from './components/InputField'
import Login from './components/Login'
import Wordlist from './components/Wordlist'
import { useEffect, useState } from 'react'
import uuid from 'react-uuid'
import { auth, db } from "./firebase";
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, where } from "firebase/firestore";
import Articlelist from './components/Articlelist'
import ArticlelistInputField from './components/ArticlelistInputField'
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary'
import { Listening } from './components/Listening'
import { VoiceSettingsProvider } from './contexts/VoiceSettingsContext'
import VoiceSettings from './components/VoiceSettings'

function App() {
  // const [notes, setNotes] = useState(JSON.parse(localStorage.getItem("notes")) || []);
  const [user, setUser] = useState(null);
  const [wordId, setWordId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  // 英単語・英文の取得
  useEffect(() => {
    if (!user || !wordId) return;
    const q = query(
      collection(db, "English_words"),
      where("userId", "==", user.uid),
      where("id", "==", wordId)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData = [];
      querySnapshot.forEach((doc) => {
        notesData.push({ ...doc.data(), id: doc.id });
      });
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, [user, wordId]);


  // 新規英単語・英文作成
  const onAddNote = async (noteData) => {
    const newNote = {
      english: noteData?.english || '',
      japanese: noteData?.japanese || '',
      modDate: Date.now(),
      createDate: Date.now(),
      remenber: false,
      userId: user.uid,  // ユーザーIDを追加
      id: wordId
    };
    await addDoc(collection(db, "English_words"), newNote);
  };

  // ログアウト機能
  const handleLogout = () => {
    auth.signOut();
  };

  // チェックボックスの更新処理
  const onUpdateCheckbox = async (noteId, isChecked) => {
    const noteRef = doc(db, "English_words", noteId);
    await updateDoc(noteRef, {
      remenber: isChecked
    });
  };

  // 英単語・英文削除
  const onDeleteNote = async (id) => {
    await deleteDoc(doc(db, "English_words", id));
  };

  const getActiveNote = () => {
    // findは一致したデータを取得する関数
    return notes.find((note) => note.id === activeNote);
  }

  // 英単語・英文更新
  const onUpdateNote = async (updatedNote) => {
    const noteRef = doc(db, "English_words", updatedNote.id);
    await updateDoc(noteRef, {
      english: updatedNote.english,
      japanese: updatedNote.japanese,
      modDate: updatedNote.modDate
    });
  };

  // 「＜」押下でレイアウトを動かす
  const display = () => {
    console.log('aaa')
    const app = document.querySelector('.App');
    app.classList.toggle('hidden');
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // ログインしていない場合はログインコンポーネントを表示
  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <VoiceSettingsProvider>
        <div className='App'>
          <button 
            className="sidebar-toggle" 
            onClick={toggleSidebar}
            aria-label="メニューを開く"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Sidebar
            userName={user.displayName}
            handleLogout={handleLogout}
            display={display}
            activeNote={activeNote}
            setActiveNote={setActiveNote}
            setWordId={setWordId}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
          />
          <Routes>
            <Route path="/words/:wordsId" element={
              wordId == null ? (
                <div className='no-active-note'>←フォルダが選択されていません</div>
              ) : (
                <>
                  <div className='main'>
                    <ErrorBoundary>
                      <InputField
                        activeNote={getActiveNote()}
                        onUpdateNote={onUpdateNote}
                      />
                    </ErrorBoundary>

                    <Wordlist
                      onUpdateNote={onUpdateNote}
                      userName={user.displayName}
                      handleLogout={handleLogout}
                      onAddNote={onAddNote}
                      notes={notes}
                      onDeleteNote={onDeleteNote}
                      activeNote={activeNote}
                      setActiveNote={setActiveNote}
                      onUpdateCheckbox={onUpdateCheckbox}
                      wordId={wordId}
                    />
                  </div>
                </>
              )
            } />
            <Route path="/listening" element={
              <>
                <div className='main'>
                  <Listening
                    notes={notes}
                    onUpdateCheckbox={onUpdateCheckbox}
                  />
                </div>
              </>}
            />
            <Route path="/voice-settings" element={
              <>
                <div className='main'>
                  <VoiceSettings />
                </div>
              </>}
            />
          </Routes>
        </div>
      </VoiceSettingsProvider>
    </BrowserRouter>
  )
}

export default App
