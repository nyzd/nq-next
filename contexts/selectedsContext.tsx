"use client";

import { createLocalStorageContext } from "@yakad/lib";

interface Selected {
    mushafUUID: string;
    ayahUUID: string | undefined;
    translationUUID: string;
    translationByWordUUID: string;
    recitationUUID: string;
}

const defaultSelected: Selected = {
    mushafUUID: "hafs",
    ayahUUID: undefined,
    translationUUID: "UUID",
    translationByWordUUID: "UUID",
    recitationUUID: "UUID",
};

const [SelectedProvider, useSelected] = createLocalStorageContext<Selected>(
    "selected",
    defaultSelected
);

export { SelectedProvider, useSelected };
