"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";

export type PlayBackRate = 0.5 | 1 | 1.25 | 1.5 | 1.75 | 2;
export type RepeatRange = 
        | "surah"
        | "juz"
        | "hizb"
        | "ruku"
        | "page"

// ----- 1. Types for each storage section -----
interface Options {
    arabicFont: "test";
    arabicFontSize: "small" | "medium" | "large";
    translationFontSize: "small" | "medium" | "large";

    playing: boolean;
    playBoxShow: boolean;
    recitationStatus: boolean;
    playBackRate: PlayBackRate;
    playBackActive: boolean;
    repeatMode: "off" | "range" | "ayah";
    repeatRange: RepeatRange;
    autoScroll: boolean;
}
interface Selected {
    mushafUUID: string;
    ayahUUID: string | undefined;
    translationUUID: string;
    translationByWordUUID: string;
    recitationUUID: string;
}
// ----- 2. Combined Storage type -----
interface Storage {
    options: Options;
    selected: Selected;
}

// ----- 3. Default values -----
const defaultStorage: Storage = {
    options: {
        arabicFont: "test",
        arabicFontSize: "medium",
        translationFontSize: "medium",

        playing: false,
        playBoxShow: false,
        recitationStatus: true,
        playBackActive: false,
        playBackRate: 1,
        repeatMode: "off",
        repeatRange: "surah",
        autoScroll: true,
    },
    selected: {
        mushafUUID: "hafs",
        ayahUUID: undefined,
        translationUUID: "UUID",
        translationByWordUUID: "UUID",
        recitationUUID: "UUID",
    },
};

// ----- 4. Context value type -----
interface StorageContextType {
    storage: Storage;
    setStorage: Dispatch<SetStateAction<Storage>>;
}

// ----- 5. Create context -----
const StorageContext = createContext<StorageContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "storage";

// ----- 6. Provider component -----
export const StorageProvider = ({ children }: { children: ReactNode }) => {
    const [storage, setStorage] = useState<Storage>(defaultStorage);

    // Load from localStorage on first render
    useEffect(() => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as Partial<Storage>;
                setStorage((prev) => ({
                    ...prev,
                    ...parsed,
                    options: {
                        ...prev.options,
                        ...parsed.options,
                        // Set data on refresh
                        playing: defaultStorage.options.playing, 
                        repeatMode: defaultStorage.options.repeatMode,
                        playBackActive: defaultStorage.options.playBackActive,
                        playBoxShow: prev.selected.ayahUUID !== undefined,
                    },
                }));
            } catch (error) {
                console.error(
                    "Failed to parse storage from localStorage",
                    error
                );
            }
        }
    }, []);

    // Save to localStorage on storage change
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storage));
    }, [storage]);

    return (
        <StorageContext.Provider value={{ storage, setStorage }}>
            {children}
        </StorageContext.Provider>
    );
};

// ----- 7. Custom hook -----
export const useStorage = (): StorageContextType => {
    const context = useContext(StorageContext);
    if (!context) {
        throw new Error("useStorage must be used within a StorageProvider");
    }
    return context;
};
