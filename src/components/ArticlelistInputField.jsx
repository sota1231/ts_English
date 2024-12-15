import React, { useEffect, useState, useCallback } from 'react'
import debounce from 'lodash/debounce';
import "./InputField.css"

const InputField = ({ activeNote, onUpdateNote }) => {
  // ローカルステート
  const [localEnglish, setLocalEnglish] = useState(activeNote?.english || "");
  const [localJapanese, setLocalJapanese] = useState(activeNote?.japanese || "");

  // activeNoteが変更されたら、ローカルステートも更新
  useEffect(() => {
    if (activeNote) {
      setLocalEnglish(activeNote.english || "");
      setLocalJapanese(activeNote.japanese || "");
    }
  }, [activeNote]);

  // Firebaseへの保存を遅延させる
  const saveToFirebase = useCallback(
    debounce((updatedNote) => {
      onUpdateNote(updatedNote);
    }, 500),
    [onUpdateNote]
  );

  const handleEnglishChange = (e) => {
    const newValue = e.target.value;
    setLocalEnglish(newValue);  // ローカルステートは即時更新
    saveToFirebase({           // Firebaseへの保存は遅延
      ...activeNote,
      english: newValue,
      modDate: Date.now()
    });
  };

  const handleJapaneseChange = (e) => {
    const newValue = e.target.value;
    setLocalJapanese(newValue);  // ローカルステートは即時更新
    saveToFirebase({            // Firebaseへの保存は遅延
      ...activeNote,
      japanese: newValue,
      modDate: Date.now()
    });
  };

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
            value={localEnglish}
            onChange={handleEnglishChange}
          />
        </div>
        <div className='japanese_field'>
          <strong>日本語：</strong>
          <textarea
            id='japanese-textarea'
            placeholder='翻訳を記入'
            value={localJapanese}
            onChange={handleJapaneseChange}
          />
        </div>
      </div>
    </div>
  );
};

export default InputField;