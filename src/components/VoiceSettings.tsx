import React from 'react';
import { useVoiceSettings } from '../contexts/VoiceSettingsContext';
import './VoiceSettings.css';
import { VoiceSettingsType, VoiceSettingsContextType } from "../type";

const VoiceSettings: React.FC = () => {
    const { voiceSettings, updateVoiceSettings } = useVoiceSettings();

    const speakEnglish = (text: string) => {
        if (window.responsiveVoice) {
            window.responsiveVoice.cancel();
        }
        
        if (window.responsiveVoice) {
            window.responsiveVoice.speak(text, "US English Female", {
                rate: voiceSettings.rate,
                pitch: voiceSettings.pitch,
                volume: voiceSettings.volume,
                onend: () => {
                    console.log('読み上げ完了');
                },
                onerror: (error: unknown) => {
                    console.error('読み上げエラー:', error);
                }
            });
        }
    };

    return (
        <div className="voice-settings-container">
            <h2>音声設定</h2>
            <div className="voice-settings-content">
                <div className="voice-setting-item">
                    <label>速度: {voiceSettings.rate.toFixed(1)}</label>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={voiceSettings.rate}
                        onChange={(e) => updateVoiceSettings('rate', parseFloat(e.target.value))}
                    />
                </div>
                <div className="voice-setting-item">
                    <label>ピッチ: {voiceSettings.pitch.toFixed(1)}</label>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={voiceSettings.pitch}
                        onChange={(e) => updateVoiceSettings('pitch', parseFloat(e.target.value))}
                    />
                </div>
                <div className="voice-setting-item">
                    <label>音量: {voiceSettings.volume.toFixed(1)}</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={voiceSettings.volume}
                        onChange={(e) => updateVoiceSettings('volume', parseFloat(e.target.value))}
                    />
                </div>
                <div className="test-section">
                    <h3>テスト再生</h3>
                    <div className="test-buttons">
                        <button 
                            className="test-voice-button"
                            onClick={() => speakEnglish("This is a test of voice settings")}
                        >
                            基本テスト
                        </button>
                        <button 
                            className="test-voice-button"
                            onClick={() => speakEnglish("The quick brown fox jumps over the lazy dog")}
                        >
                            長文テスト
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceSettings; 