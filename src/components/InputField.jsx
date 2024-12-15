import React, { useEffect, useRef, useState } from 'react'
import "./InputField.css"

const InputField = ({ activeNote, onUpdateNote }) => {
  // 日本語入力用のローカルステート
  const [localJapanese, setLocalJapanese] = useState(activeNote?.japanese || "");

  // activeNoteが変更されたら、localJapaneseも更新
  useEffect(() => {
    if (activeNote) {
      setLocalJapanese(activeNote.japanese || "");
    }
  }, [activeNote]);

  // 画面クリック時の処理
  useEffect(() => {
    const handleDocumentClick = (e) => {
      // 日本語のtextarea以外をクリックした時
      if (e.target.id !== 'japanese-textarea' && 
          localJapanese !== activeNote?.japanese) {
        onUpdateNote({
          ...activeNote,
          japanese: localJapanese,
          modDate: Date.now()
        });
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [localJapanese, activeNote, onUpdateNote]);

  if (!activeNote) {
    return <div className='no-active-note'>ノートが選択されていません</div>;
  }

  return (
    <div className='app-main'>
      <div className="app-main-note-edit">
        <div className='english_field'>
          <strong>英語：</strong>
          <textarea
            id='english-textarea'
            type="text"
            placeholder='英語を記入'
            value={activeNote.english}
            onChange={(e) => {
              onUpdateNote({
                ...activeNote,
                english: e.target.value,
                modDate: Date.now()
              });
            }}
          />
        </div>
        <div className='japanese_field'>
          <strong>日本語：</strong>
          <textarea
            id='japanese-textarea'
            placeholder='翻訳を記入'
            value={localJapanese}
            onChange={(e) => setLocalJapanese(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default InputField;