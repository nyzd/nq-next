"use client";

import { createLocalStorageContext } from "@yakad/lib";

export type PlayBackRate = 0.5 | 1 | 1.25 | 1.5 | 1.75 | 2;
export type RepeatRange = 
        | "surah"
        | "juz"
        | "hizb"
        | "ruku"
        | "page";

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

const defaultOptions: Options = {
    arabicFont: "test",
    arabicFontSize: "medium",
    translationFontSize: "medium",

    playing: false,
    playBoxShow: false,
    recitationStatus: true,
    playBackActive: false,
    playBackRate: 1.5,
    repeatMode: "off",
    repeatRange: "surah",
    autoScroll: true,
}

const [OptionsProvider, useOptions] =
    createLocalStorageContext<Options>("options", defaultOptions);

export { OptionsProvider, useOptions };