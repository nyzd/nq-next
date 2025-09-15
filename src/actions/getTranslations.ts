"use server";

import { translationsAyahsList, translationsList } from "@ntq/sdk";

export async function getTranslations(mushaf: "hafs" = "hafs", limit: number, offset: number = 0, language: any = "en") {
    const resp = await translationsList({ query: { mushaf: mushaf, limit: limit, offset: offset, language: language } });

    return resp.data ?? [];
}

export async function getTranslationAyahs(uuid: string, limit: number, offset: number = 0) {
    const resp = await translationsAyahsList({ path: { uuid: uuid }, query: { limit: limit, offset: offset } });

    return resp.data ?? [];
}