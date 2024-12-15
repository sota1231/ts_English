
import React, { useEffect, useRef, useState } from 'react'
import "./ArticlelistInputField.css"

const ArticlelistInputField = ({ activeNote, onUpdateNote }) => {
  // localNoteの初期化を遅延させる
  const [localNote, setLocalNote] = useState(null);

  // activeNoteが有効な値になったときにlocalNoteを初期化
  useEffect(() => {
    if (activeNote) {
      setLocalNote({
        english: activeNote.english || "",
        japanese: activeNote.japanese || ""
      });
    }
  }, [activeNote]);

  // 日本語入力中はlocalNoteに保存
  const handleJapaneseInput = (value) => {
    setLocalNote(prev => ({
      ...prev,
      japanese: value
    }));
  };

  // 英語入力は直接Firebase更新
  const handleEnglishInput = (value) => {
    onUpdateNote({
      ...activeNote,
      english: value,
      modDate: Date.now()
    });
  };

  // localNoteがnullの場合は早期リターン
  if (!activeNote || !localNote) {
    return <div className='no-active-note'>ノートが選択されていません</div>
  }

  // クリックイベントのハンドラー
  const handleDocumentClick = (e) => {
    // 日本語のtextarea以外がクリックされ、かつ入力内容に変更があった場合
    if (e.target.id !== 'japanese-textarea' && localNote.japanese !== activeNote.japanese) {
      onUpdateNote({
        ...activeNote,
        japanese: localNote.japanese,
        modDate: Date.now()
      });
    }
  };

  // コンポーネントのマウント時にイベントリスナーを設定
  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [localNote]);

  // const onEditNote = (key, value) => {
  //   onUpdateNote({
  //     ...activeNote,
  //     [key]: value,
  //     modDate: Date.now()
  //   })
  // }

  

  return (
    <div className='app-main'>
      <div className="app-main-note-edit">
        <div className='english_field'>
          <strong>英語：</strong>
          <textarea
            id='title'
            type="text"
            placeholder='英語を記入'
            value={activeNote.english}
            onChange={(e) => handleEnglishInput(e.target.value)}
          ></textarea>
        </div>
        <div className='japanese_field'>
          <strong>日本語：</strong>
          <textarea
            id='japanese-textarea'
            placeholder='翻訳を記入'
            // value={localNote.japanese && (
            //   localNote.japanese)}
            onChange={(e) => handleJapaneseInput( e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  )
}

export default ArticlelistInputField