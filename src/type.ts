export interface Note {
    id: string;
    english: string;
    japanese: string;
    remember: boolean;
    createDate: number;
    modDate: number | null;
}

export type NewNoteData = {
  english?: string;
  japanese?: string;
}

// responsiveVoice
declare global {
  interface Window {
    responsiveVoice: {
      speak: (
        text: string,
        voice?: string,
        parameters?: {
          rate?: number;
          pitch?: number;
          volume?: number;
          onend?: () => void;
          onerror?: ( error: any) => void;
        }
      ) => void;
      cancel: () => void;
    };
  }
}

// Wordlist　Props
export interface WordlistProps {
    onAddNote: () => void;
    notes: Note[];
    onDeleteNote: (id: string) => void;
    activeNote: string | null;
    setActiveNote: (note: string | null) => void;
    onUpdateCheckbox: (id: string, value: boolean) => void;
    wordId: string | null;
    onAddNoteCSV:(noteData: NewNoteData) => void;
}

// voiceSetting 
export interface VoiceSettingsType {
  rate: number;
  pitch: number;
  volume: number;
}
export interface VoiceSettingsContextType {
  voiceSettings: VoiceSettingsType;
  updateVoiceSettings: (key: keyof VoiceSettingsType, value: number) => void;
}

// Sideber Props
export interface SidebarPropsType {
    handleLogout: () =>void, 
    setWordId: React.Dispatch<React.SetStateAction<string | null>>, 
    isOpen: boolean, 
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

// ListeningProps
export interface ListeningPropsType {
    notes: Note[], 
    onUpdateCheckbox: (noteId: string, isChecked: boolean) => Promise<void>;
}


// InputFieldProps
export interface InputFieldPropsType {
    activeNote: Note | undefined,
    onUpdateNote: (UpdatedNoteType) => Promise<void>;
}
export type UpdatedNoteType = {
    id: string,
    english: string,
    japanese: string,
    modDate: number
}