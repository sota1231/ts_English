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
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  // const [notes, setNotes] = useState(JSON.parse(localStorage.getItem("notes")) || []);
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(false);


  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);
  // useEffect(() => {
  //   localStorage.setItem("notes",JSON.stringify(notes));
  // },[notes])

  // // 読み込まれたときに発火（１番目のデータを表示）
  // useEffect(() => {
  //   if(notes[0]){
  //     setActiveNote(notes[0].id);
  //   }
  // },[])

  // ノートの取得
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "English_words"),
      where("userId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData = [];
      querySnapshot.forEach((doc) => {
        notesData.push({ ...doc.data(), id: doc.id });
      });
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, [user]);

  // 新規ノート作成
  // const onAddNote = () => {
  //   console.log("追加");
  //   const newNote = {
  //     id: uuid(),
  //     title: "新しいノート",
  //     content: "新しいノートの内容",
  //     modDate: Date.now(),
  //   };
  //   setNotes([...notes, newNote]);
  //   console.log(notes);
  // };

  // 新規ノート作成
  const onAddNote = async () => {
    const newNote = {
      english: "",
      japanese: "",
      modDate: Date.now(),
      createDate:  Date.now(),
      remenber: false,
      userId: user.uid  // ユーザーIDを追加
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



  // const onDeleteNote = (id) => {
  //   // filterは残す関数。idが一致しないものだけを残す
  //   const filterNotes = notes.filter((note) => note.id !== id);
  //   setNotes(filterNotes);
  // }
  // ノート削除
  const onDeleteNote = async (id) => {
    await deleteDoc(doc(db, "English_words", id));
  };

  const getActiveNote = () => {
    // findは一致したデータを取得する関数
    return notes.find((note) => note.id === activeNote);
  }

  // 修正された新しいNoteを返すロジック
  // const onUpdateNote = (updatedNote) => {
  //   const updateNotesArray = notes.map((note) => {
  //     if (note.id === updatedNote.id) {
  //       return updatedNote;
  //       // return;
  //     }else {
  //       return note;
  //     }
  //   });

  //   setNotes(updateNotesArray);
  // }

  // ノート更新
  const onUpdateNote = async (updatedNote) => {
    const noteRef = doc(db, "English_words", updatedNote.id);
    await updateDoc(noteRef, {
      english: updatedNote.english,
      japanese: updatedNote.japanese,
      modDate: updatedNote.modDate
    });
  };

  // ログインしていない場合はログインコンポーネントを表示
  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <div className='App'>
        {/* <div className="app-header">
        <span>ようこそ、{user.displayName}さん！</span>
        <button onClick={handleLogout}>ログアウト</button>
      </div> */}
        <Sidebar
          userName={user.displayName}
          handleLogout={handleLogout}
          onAddNote={onAddNote}
          notes={notes}
          onDeleteNote={onDeleteNote}
          activeNote={activeNote}
          setActiveNote={setActiveNote}
        />
        <Routes>
          <Route path="/words" element={
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
              />
            </div>
          } />
          
          <Route path="/articles" element={
            <div className='main'>
              <ArticlelistInputField
                activeNote={getActiveNote()}
                onUpdateNote={onUpdateNote}
              />
              <Articlelist
                userName={user.displayName}
                handleLogout={handleLogout}
                onAddNote={onAddNote}
                notes={notes}
                onDeleteNote={onDeleteNote}
                activeNote={activeNote}
                setActiveNote={setActiveNote}
                onUpdateCheckbox={onUpdateCheckbox}
              />
            </div>
          } />

        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
