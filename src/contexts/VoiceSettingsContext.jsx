import React, { createContext, useState, useContext, useEffect } from 'react';

const VoiceSettingsContext = createContext();

export const VoiceSettingsProvider = ({ children }) => {
    // ローカルストレージから設定を読み込む
    const loadSettings = () => {
        const savedSettings = localStorage.getItem('voiceSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            rate: 0.9,
            pitch: 1,
            volume: 1
        };
    };

    const [voiceSettings, setVoiceSettings] = useState(loadSettings);

    // 設定が変更されたらローカルストレージに保存
    useEffect(() => {
        localStorage.setItem('voiceSettings', JSON.stringify(voiceSettings));
    }, [voiceSettings]);

    const updateVoiceSettings = (setting, value) => {
        setVoiceSettings(prev => ({
            ...prev,
            [setting]: value
        }));
    };

    return (
        <VoiceSettingsContext.Provider value={{ voiceSettings, updateVoiceSettings }}>
            {children}
        </VoiceSettingsContext.Provider>
    );
};

export const useVoiceSettings = () => {
    const context = useContext(VoiceSettingsContext);
    if (!context) {
        throw new Error('useVoiceSettings must be used within a VoiceSettingsProvider');
    }
    return context;
}; 