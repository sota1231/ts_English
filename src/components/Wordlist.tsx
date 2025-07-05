import React, { useEffect, useState } from 'react'
import './Wordlist.css';
import { useVoiceSettings } from '../contexts/VoiceSettingsContext';
import { Note, WordlistProps } from '../type.tsx'

const Wordlist: React.FC<WordlistProps> = ({
    onAddNote,
    notes,
    onDeleteNote,
    activeNote,
    setActiveNote,
    onUpdateCheckbox,
    wordId,
    onAddNoteCSV
}) => {
    const { voiceSettings } = useVoiceSettings();
    const [ csvInputKey, setCsvInputKey ] = useState<number>(Date.now());

    // 読み上げ機能の追加　ーーーーーーーーーーーーーーーーーーーー
    const speakEnglish = (text: string) => {
        // 既存の音声を停止
        if (window.responsiveVoice) {
            window.responsiveVoice.cancel();
        }

        // ResponsiveVoiceを使用して音声読み上げ
        if (window.responsiveVoice) {
            window.responsiveVoice.speak(text, "US English Female", {
                rate: voiceSettings.rate,
                pitch: voiceSettings.pitch,
                volume: voiceSettings.volume,
                onend: () => {
                    console.log('読み上げ完了');
                },
                onerror: (error) => {
                    console.error('読み上げエラー:', error);
                }
            });
        } else {
            console.error('ResponsiveVoiceが利用できません');
        }
    };

    // ページが読み込まれたときに音声を初期化
    useEffect(() => {
        if (window.responsiveVoice) {
            console.log('ResponsiveVoiceが利用可能です');
        } else {
            console.error('ResponsiveVoiceが利用できません');
        }
    }, []);



    // CSV出力機能　ーーーーーーーーーーーーーーーーーーーーーーー
    const exportToCSV = () => {
        // ヘッダー行を追加
        const csvData = [
            ['英語', '日本語', '暗記済み', '作成日']
        ];

        // データ行を追加
        notes.forEach(note => {
            csvData.push([
                `"${(note.english || '').replace(/"/g, '""')}"`, // /"/で「"」を探す、gがないと１つだけで処理が終わる
                `"${(note.japanese || '').replace(/"/g, '""')}"`, // 「"」を「""」に全て変える
                note.remember ? "true" : "false",
                new Date(note.createDate).toLocaleDateString()
            ]);
        });

        // CSV形式の文字列に変換
        const csvString = csvData.map(row => row.join(',')).join('\n'); // 行ごとに配列を「,」区切りで１つの文字列にしたあと、行もなくし全ての配列が１つの文字列にする

        // BOMを追加してShift-JISでエンコード
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        const blob = new Blob([bom, csvString], { type: 'text/csv;charset=utf-8;' });

        // ダウンロードリンクを作成
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const csv_title = wordId === '1' ? '注文' : wordId === '2' ? '交通' : wordId === '3' ? '旅行先会話' : wordId === '4' ? '映画' : wordId === '5' ? '英単語' : '英会話';
        link.download = `${csv_title}_${new Date().toLocaleDateString()}.csv`;

        // リンクをクリックしてダウンロード開始
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // CSV入力処理　ーーーーーーーーーーーーーーーーーーーーーーーー
    const importFromCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0)  return; // null対策
        
        const file = files[0];

        // 確認ダイアログを表示
        if (!window.confirm('既存のデータがすべて削除され、CSVのデータで上書きされます。よろしいですか？')) {
            e.target.value = ''; // ファイル選択をリセット
            return;
        }

        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                // BOMを除去してCSVを行に分割
                const Text = event?.target?.result;
                if (typeof Text === 'string') {  // 型をstringに絞るため対策
                    const csvText = Text.replace(/^\uFEFF/, '');
                    const rows = csvText.split('\n');

                    // 既存の英単語・英文をすべて削除
                    notes.forEach(note => {
                        onDeleteNote(note.id);
                    });

                    // ヘッダー行をスキップしてデータ処理
                    for (let i = 1; i < rows.length; i++) {
                        if (!rows[i].trim()) continue; // 空行をスキップ

                        const columns = rows[i].split(',');
                        const englishText = columns[0]?.trim().replace(/^"|"$/g, '').replace(/""/g, '"'); // 先頭(/^)と末尾($/)のダブルクオートを削除
                        const japaneseText = columns[1]?.trim().replace(/^"|"$/g, '').replace(/""/g, '"'); // 「""」を「"」に置換

                        if (!englishText) continue; // 英語が空の行はスキップ

                        // 新規英単語・英文を作成
                        const newNote: Note = {
                            folderId: wordId ? wordId.toString() : '',
                            // id: Date.now().toString(),
                            english: englishText,
                            japanese: japaneseText || '',
                            createDate: Date.now(),
                            modDate: Date.now(),
                            remember: false
                        };

                        await onAddNoteCSV(newNote);
                    }
                    alert('CSVファイルのインポートが完了しました');
                    setCsvInputKey(Date.now());
                } else {
                    console.error('ファイルの読み込み結果が文字列ではありません');
                }
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
                <button className='new_post' onClick={() => onAddNote()}>新規作成</button>
                <button className='csv_output' onClick={exportToCSV}>CSV出力</button>
                <input
                    key={csvInputKey}
                    type="file"
                    accept=".csv"
                    onChange={importFromCSV}
                    style={{ display: 'none' }}
                    id="csv-input"
                />
                <button className='csv_input'
                    onClick={() => document.getElementById('csv-input')!.click()}>
                    CSVからインポート
                </button>
            </div>
            {!sortedNotes || sortedNotes.length === 0 ? (
                <div className='no-active-note'>新規作成を行ってください</div>
            ) : (
                <div className='app-wordlist-notes'>
                    {sortedNotes.map((note) => (
                        <div
                            className={`app-wordlist-note ${note.id === activeNote ? "active" : ""}`}
                            key={note.id}
                            onClick={() => setActiveNote(note.id)}
                        >
                            <input
                                type="checkbox"
                                checked={note.remember}
                                onChange={(e) => onUpdateCheckbox(note.id, e.target.checked)}
                            />
                            <button
                                onClick={() => speakEnglish(note.english)}
                                className="speak-button">
                                英語を読む
                            </button>
                            <div className='title_deleteButton'>
                                <div className='wordlist-note-title'>
                                    <strong>{note.english ? note.english : 'クリックしてください'}</strong>
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