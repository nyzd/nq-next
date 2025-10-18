"use client";

import { createLocalStorageContext } from "@yakad/lib";

export interface MushafOptions {
    arabicFont: "test";
    arabicFontSize: "small" | "medium" | "large";
    textAlign: "normal" | "center";
    translationFontSize: "small" | "medium" | "large";
}

const defaultMushafOptions: MushafOptions = {
    arabicFont: "test",
    arabicFontSize: "medium",
    textAlign: "center",
    translationFontSize: "medium",
};

const [MushafOptionsProvider, useMushafOptions] =
    createLocalStorageContext<MushafOptions>(
        "mushafOptions",
        defaultMushafOptions
    );

export { MushafOptionsProvider, useMushafOptions };
