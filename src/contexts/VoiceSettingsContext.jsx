import React, { createContext, useState, useContext, useEffect } from 'react';

const VoiceSettingsContext = createContext(); // グローバルに共有できる準備

export const VoiceSettingsProvider = ({ children }) => {
    const loadSettings = () => {
        const savedSettings = localStorage.getItem('voiceSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            rate: 0.9,
            pitch: 1,
            volume: 1
        };
    };

    const [voiceSettings, setVoiceSettings] = useState(loadSettings);

    // ①発火したら引数（設定変更箇所）のみ変更してあとはそのまま　voiceSettingsが変更されるのでuseEffectが発火
    const updateVoiceSettings = (setting, value) => {
        setVoiceSettings(prev => ({
            ...prev,
            [setting]: value
        }));
    };

    // ②設定が変更されたらローカルストレージに保存
    useEffect(() => {
        localStorage.setItem('voiceSettings', JSON.stringify(voiceSettings));
    }, [voiceSettings]);

    // voiceSettingsとupdateVoiceSettingsを子コンポーネントで使えるように設定
    return (
        <VoiceSettingsContext.Provider value={{ voiceSettings, updateVoiceSettings }}>
            {children}
        </VoiceSettingsContext.Provider>
    );
};

// カスタムフック作成、子コンポーネントでuseState()の要領で使用する
export const useVoiceSettings = () => {
    const context = useContext(VoiceSettingsContext);
    if (!context) {
        throw new Error('useVoiceSettings must be used within a VoiceSettingsProvider');
    }
    return context;
}; 