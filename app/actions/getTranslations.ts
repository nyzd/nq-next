"use server";

import { translationsAyahsList, translationsList, TranslationsListData} from "@ntq/sdk";

export async function getTranslations(
    mushaf: "hafs" = "hafs",
    limit: number,
    offset: number = 0,
    language: TranslationsListData["query"]["language"] | null =null
) {
    const resp = await translationsList({
        query: {
            mushaf: mushaf,
            limit: limit,
            offset: offset,
            language: language || undefined
        },
    });

    if (!resp.data) throw new Error("Error when getting translations list");

    return resp.data;
}

export async function getTranslationAyahs(
    uuid: string,
    limit: number,
    offset: number = 1
) {
    const resp = await translationsAyahsList({
        path: { uuid: uuid },
        query: { limit: limit, offset: offset },
    });

    if (!resp.data)
        throw new Error("Error when getting translation ayahs list");

    return resp.data;
}
