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

function App() {
  // const [notes, setNotes] = useState(JSON.parse(localStorage.getItem("notes")) || []);
  const [user, setUser] = useState(null);
  const [wordId, setWordId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activeNote, setActiveNote] = useState(false);

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  // フォルダ情報の取得
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "Folders"),
      where("userId", "==", user.uid)
    );
    const aaa = onSnapshot(q, (querySnapshot) => {
      const foldersData = [];
      querySnapshot.forEach((doc) => {
        foldersData.push({ ...doc.data(), id: doc.id });
      });
      setFolders(foldersData);
    });

    return () => aaa(); //TODO 命名する
  }, [user]);

  // ノートの取得
  useEffect(() => {
    if (!user || !wordId) return;
    const q = query(
      collection(db, "English_words"),
      where("userId", "==", user.uid),
      where("id", "==", wordId)
    );
    console.log('aaa' + wordId)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData = [];
      querySnapshot.forEach((doc) => {
        notesData.push({ ...doc.data(), id: doc.id });
      });
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, [user, wordId]);


  // 新規フォルダ作成
  const onAddFolder = async (folderData) => {
    const newFolder = {
      id: wordId, // TODO 自動採番
      userId: user.uid,
      name: '',
      modDate: Date.now(),
      createDate: Date.now()
    };
    await addDoc(collection(db, "Folders"), newFolder);
  };

  // 新規ノート作成
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

  // フォルダ削除
  const onDeleteFolder = async (id) => {
    try {
      await deleteDoc(doc(db, "Folders", id));

      const wordsQuery = query(
        collection(db, "English_words"),
        where("folderId", "==", id)
      );

      const querySnapshot = await getDocs(wordsQuery);
      const deletePromises = querySnapshot.docs.map(doc => doleteDoc(doc.ref));
      await Promise.all(deletePromises);


    } catch (error) {
      console.error("フォルダ削除中にエラー：", error);
    }
  };

  // ノート削除
  const onDeleteNote = async (id) => {
    await deleteDoc(doc(db, "English_words", id));
  };

  const getActiveNote = () => {
    // findは一致したデータを取得する関数
    return notes.find((note) => note.id === activeNote);
  }

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
        <Sidebar
          userName={user.displayName}
          handleLogout={handleLogout}
          onAddFolder={onAddFolder}
          folders={folders}
          onDeleteFolder={onDeleteFolder}
          activeNote={activeNote}
          setActiveNote={setActiveNote}
          setWordId={setWordId}
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
                    onAddFolder={onAddFolder}
                    notes={notes}
                    onDeleteNote={onDeleteNote}
                    activeNote={activeNote}
                    setActiveNote={setActiveNote}
                    onUpdateCheckbox={onUpdateCheckbox}
                  />
                </div>
              </>
            )
          } />

          {/* <Route path="/articles" element={
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
          } /> */}

        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
