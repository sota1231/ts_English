import React from 'react'
import './Wordlist.css';

const Wordlist = ({
    onAddNote,
    notes,
    onDeleteNote,
    activeNote,
    setActiveNote,
    userName,
    handleLogout,
    onUpdateCheckbox,
    onUpdateNote,
    wordId,
}) => {
    console.log('aaa' + wordId)


    // 読み上げ機能の追加　ーーーーーーーーーーーーーーーーーーーー
    const speakEnglish = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';  // 英語の声に設定
        utterance.rate = 0.9;      // 読み上げ速度
        utterance.pitch = 1;       // 音の高さ
        speechSynthesis.speak(utterance);
    };

    // ページが読み込まれたときに音声を取得
    window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
    };


    // CSV出力機能　ーーーーーーーーーーーーーーーーーーーーーーー
    const exportToCSV = () => {
        // ヘッダー行を追加
        const csvData = [
            ['英語', '日本語', '暗記済み', '作成日']
        ];

        // データ行を追加
        notes.forEach(note => {
            csvData.push([
                `"${(note.english || '').replace(/"/g, '""')}"`, 
                `"${(note.japanese || '').replace(/"/g, '""')}"`,
                note.remenber ? true : false,
                new Date(note.createDate).toLocaleDateString()
            ]);
        });

        // CSV形式の文字列に変換
        const csvString = csvData.map(row => row.join(',')).join('\n');

        // BOMを追加してShift-JISでエンコード
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        const blob = new Blob([bom, csvString], { type: 'text/csv;charset=utf-8;' });

        // ダウンロードリンクを作成
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `単語帳_${new Date().toLocaleDateString()}.csv`;

        // リンクをクリックしてダウンロード開始
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // CSV入力処理　ーーーーーーーーーーーーーーーーーーーーーーーー
    const importFromCSV = (e) => {
        const file = e.target.files[0];

        // 確認ダイアログを表示
        if (!window.confirm('既存のデータがすべて削除され、CSVのデータで上書きされます。よろしいですか？')) {
            e.target.value = ''; // ファイル選択をリセット
            return;
        }

        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                // BOMを除去してCSVを行に分割
                const csvText = event.target.result.replace(/^\uFEFF/, '');
                const rows = csvText.split('\n');

                // 既存のノートをすべて削除
                notes.forEach(note => {
                    onDeleteNote(note.id);
                });

                // ヘッダー行をスキップしてデータ処理
                for (let i = 1; i < rows.length; i++) {
                    if (!rows[i].trim()) continue; // 空行をスキップ

                    const columns = rows[i].split(',');
                    const englishText = columns[0]?.trim().replace(/^"|"$/g, '').replace(/""/g, '"'); // 先頭と末尾のダブルクオートを削除
                    const japaneseText = columns[1]?.trim().replace(/^"|"$/g, '').replace(/""/g, '"'); // 先頭と末尾のダブルクオートを削除

                    if (!englishText) continue; // 英語が空の行はスキップ

                    // 新規ノートを作成
                    const newNote = {
                        id: wordId,
                        // id: Date.now().toString(),
                        english: englishText,
                        japanese: japaneseText || '',
                        createDate: Date.now(),
                        modDate: Date.now(),
                        checked: false
                    };

                    await onAddNote(newNote);
                }
                alert('CSVファイルのインポートが完了しました');
            } catch (error) {
                console.error('CSVの処理中にエラーが発生しました:', error);
                alert('CSVファイルの処理中にエラーが発生しました');
            }
        };

        reader.readAsText(file);
    };


    const sortedNotes = notes.sort((a, b) => b.createDate - a.createDate)

    return (
        <div className='app-wordlist'>
            <div className='app-wordlist-header'>
                <h1>リスト</h1>
                <button className='new_post' onClick={onAddNote}>新規作成</button>
                <button className='csv_output' onClick={exportToCSV}>CSV出力</button>
                <input
                    type="file"
                    accept=".csv"
                    onChange={importFromCSV}
                    style={{ display: 'none' }}
                    id="csv-input"
                />
                <button className='csv_input'
                    onClick={() => document.getElementById('csv-input').click()}>
                    CSVからインポート
                </button>
            </div>
            {!sortedNotes || sortedNotes.length == 0 ? (<div className='no-active-note'>新規作成を行ってください</div>):(
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
                            <button
                                onClick={() => speakEnglish(note.english)}
                                className="speak-button">
                                英語を読む
                            </button>
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
            )}
        </div>
    )
}

export default Wordlist