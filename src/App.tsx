import React from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import InputField from './components/InputField'
import Login from './components/Login'
import Wordlist from './components/Wordlist'
import { useEffect, useState } from 'react'
import { auth, db } from "./firebase";
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, where, DocumentData } from "firebase/firestore";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary'
import { Listening } from './components/Listening'
import { VoiceSettingsProvider } from './contexts/VoiceSettingsContext'
import VoiceSettings from './components/VoiceSettings'
import { User } from "firebase/auth"
import { Note, NewNoteData, NoteDoc } from "./type"

function App() {
  const [user, setUser] = useState<User | null>(null); // 認証情報保持
  const [wordId, setWordId] = useState<string | null>(null); // param保持
  const [notes, setNotes] = useState<NoteDoc[]| []>([]); // 一覧データ（userとparamでwhere）
  const [listeningNotes, setListeningNotes] = useState<NoteDoc[]| []>([]); // リスニング用のnotes（userとwordIdでwhere）
  const [activeNote, setActiveNote] = useState<string | null>(null); // 選択中の英単語のidを格納
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); //　サイドバーの開閉

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
      where("folderId", "==", wordId)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData: NoteDoc[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Note, "id">; //　firebaseの.data()にはidを含まない為型からidを外す
        notesData.push({ ...data, id: doc.id }); // idデータを追加
        // const data = doc.data() as Note;
        // notesData.push({ ...data});
      });
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, [user, wordId]);

  // リスニング用の英単語・英文の取得（全てのwordId）
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "English_words"),
      where("userId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData: NoteDoc[] = [];
      querySnapshot.forEach((doc) => {
        // const data = doc.data() as Note;
        // notesData.push({ ...data});
        const data = doc.data() as Omit<Note, "id">; //　firebaseの.data()にはidを含まない為型からidを外す
        notesData.push({ ...data, id: doc.id }); // idデータを追加
      });
      setListeningNotes(notesData);
    });

    return () => unsubscribe();
  }, [user]);

  // 新規英単語作成
  const onAddNote = async () => {
    const newNote = {
      english: '',
      japanese: '',
      modDate: Date.now(),
      createDate: Date.now(),
      remember: false,
      userId: user?.uid || '',  // ユーザーIDを追加
      folderId: wordId
    };
    await addDoc(collection(db, "English_words"), newNote); // 登録処理
  };

  // 新規英単語作成
  const onAddNoteCSV = async (noteData: NewNoteData) => {
    const newNote = {
      english: noteData?.english || '',
      japanese: noteData?.japanese || '',
      modDate: Date.now(),
      createDate: Date.now(),
      remember: false,
      userId: user?.uid || '',  // ユーザーIDを追加
      folderId: wordId
    };
    await addDoc(collection(db, "English_words"), newNote); // 登録処理
  };

  // ログアウト機能
  const handleLogout = () => {
    auth.signOut();
  };

  // チェックボックスの更新処理
  const onUpdateCheckbox = async (noteId: string, isChecked: boolean) => {
    console.log('checkbox', noteId);
    const noteRef = doc(db, "English_words", noteId); // dbのデータで一致するデータを特定する
    await updateDoc(noteRef, {remember: isChecked}); // 更新処理

  };

  // 英単語・英文削除
  const onDeleteNote = async (id) => {
    await deleteDoc(doc(db, "English_words", id)); // 削除処理
  };

  // findは一致したデータを取得する関数
  const getActiveNote = () => {
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

  // 「三」押下でレイアウトを動かす
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
            // userName={user.displayName}
            handleLogout={handleLogout}
            setWordId={setWordId}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
          />
          <Routes>
            <Route path="/" element={
              <div className='no-folder'>
                <div className='child'>
                  ←フォルダが選択されていません
                </div>
              </div>
            } />
            <Route path="/words/:wordsId" element={

              <>
                <div className='main'>
                  <ErrorBoundary>
                    <InputField
                      activeNote={getActiveNote()}
                      onUpdateNote={onUpdateNote}
                    />
                  </ErrorBoundary>

                  <Wordlist
                    onAddNote={onAddNote}
                    notes={notes}
                    onDeleteNote={onDeleteNote}
                    activeNote={activeNote}
                    setActiveNote={setActiveNote}
                    onUpdateCheckbox={onUpdateCheckbox}
                    wordId={wordId}
                    onAddNoteCSV={onAddNoteCSV}
                  />
                </div>
              </>

            } />
            <Route path="/listening" element={
              <>
                <div className='main'>
                  <Listening
                    notes={listeningNotes}
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
