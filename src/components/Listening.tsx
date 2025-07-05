import React, { useEffect, useState, useCallback } from 'react'
import "./Listening.css"
import { useVoiceSettings } from '../contexts/VoiceSettingsContext';
import { ListeningPropsType, Note, NoteDoc } from '../type';

export const Listening: React.FC<ListeningPropsType> = ({ notes, onUpdateCheckbox }) => {
  const [randomWord, setRandomWord] = useState<null | NoteDoc>(null);
  const [showJapanese, setShowJapanese] = useState<boolean>(false); // 日本語表示
  const [showEnglish, setShowEnglish] = useState<boolean>(false); // 英語表示
  const [selectedWordId, setSelectedWordId] = useState<string>('1'); // 選択されたwordId
  const { voiceSettings } = useVoiceSettings();

  // 選択されたwordIdでフィルタリングされたnotes
const filteredNotes = selectedWordId !== "0"
  ? notes.filter(note => note.folderId == selectedWordId)
  : notes;
    // console.log("filteredNotes: " +filteredNotes.length)
  // console.log("Notes: " +notes)
  // console.log("selectedWordId: " +selectedWordId)
  // console.log("notes:", JSON.stringify(notes, null, 2));

  // notesが変わった時だけ中身（メモ）が変化・問題の選定
  const getRandomUnrememberedWord = useCallback(() => {
    const unrememberedWords = filteredNotes.filter(note => !note.remember);
    console.log("length: "+unrememberedWords.length)
    if (unrememberedWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * unrememberedWords.length); // 0以上1未満＊未暗記のレコードの数＝＞小数点以下は切り捨て
      setRandomWord(unrememberedWords[randomIndex]);
      // 新しい単語が選ばれたら両方とも非表示に
      setShowJapanese(false);
      setShowEnglish(false);
      console.log('今回の学習単語:', unrememberedWords[randomIndex].english);
    } else {
      setRandomWord(null);
      // console.log('未暗記の単語はありません');
    }
  }, [selectedWordId]);

  useEffect(() => {
    getRandomUnrememberedWord();
  }, [getRandomUnrememberedWord]);

  const speakEnglish = (text) => {
    // 既存の音声を停止
    if (window.responsiveVoice) {
      window.responsiveVoice.cancel();
    }
    // console.log('読み上げ: ' + text);
    
    // ResponsiveVoiceを使用して音声読み上げ
    if (window.responsiveVoice) {
      window.responsiveVoice.speak(text, "US English Female", {
        rate: voiceSettings.rate,
        pitch: voiceSettings.pitch,
        volume: voiceSettings.volume,
        onend: () => {
          // console.log('読み上げ完了');
        },
        onerror: (error) => {
          // console.error('読み上げエラー:', error);
        }
      });
    } else {
      // console.error('ResponsiveVoiceが利用できません');
    }
  };

  // ページが読み込まれたときに音声を初期化
  useEffect(() => {
    // ResponsiveVoiceの初期化確認
    if (window.responsiveVoice) {
      console.log('ResponsiveVoiceが利用可能です');
    } else {
      console.error('ResponsiveVoiceが利用できません');
    }
  }, []);

  const markAsRemembered = () => {
    if (randomWord) {
      console.log('checkbox_before', randomWord.id);
      onUpdateCheckbox(randomWord.id, true);
      getRandomUnrememberedWord();
    }
  };

  return (
    <div className="listening-container">
      <div className="word-id-selector">
        <label htmlFor="wordIdSelect">カテゴリを選択:</label>
        <select
          id="wordIdSelect"
          value={selectedWordId}
          onChange={(e) => setSelectedWordId(e.target.value)}
        >
          <option value="0">すべて</option>
          <option value="1">注文</option>
          <option value="2">交通</option>
          <option value="3">旅行先会話</option>
          <option value="4">映画</option>
          <option value="5">単語・短文</option>
          <option value="6">英会話</option>
        </select>
      </div>
      {randomWord ? (
        <>
          <div className="word-display">
            <h2>リスニング練習</h2>
            <div className="control-buttons">
              <button className="play-button" onClick={() => speakEnglish(randomWord.english)}>
                再生する▶
              </button>
              <button className="show-english" onClick={() => setShowEnglish(!showEnglish)}>
                {showEnglish ? '英語を隠す' : '英語を表示'}
              </button>
              <button className="show-japanese" onClick={() => setShowJapanese(!showJapanese)}>
                {showJapanese ? '日本語を隠す' : '日本語を表示'}
              </button>
              <button className="next-word" onClick={getRandomUnrememberedWord}>
                次の単語
              </button>
              <button className="mark-remembered" onClick={markAsRemembered}>
                暗記済みにする
              </button>
            </div>
            <div className="english-section">
              {showEnglish ? (
                <div className="english-word">{randomWord.english}</div>
              ) : (
                <div className="hidden-word">???</div>
              )}
            </div>
            <div className="japanese-section">
              {showJapanese ? (
                <div className="japanese-word">{randomWord.japanese}</div>
              ) : (
                <div className="hidden-word">???</div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="no-words">
          未暗記の単語がありません
        </div>
      )}
    </div>
  );
};

export default Listening;