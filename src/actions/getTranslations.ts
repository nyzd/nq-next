import { translationsAyahsList, translationsList } from "@ntq/sdk";

export async function getTranslations(mushaf: "hafs" = "hafs", limit: number, offset: number = 0) {
    const resp = await translationsList({ query: { mushaf: mushaf, limit: limit, offset: offset } });

    return resp.data ?? [];
}

export async function getTranslationAyahs(uuid: string) {
    const resp = await translationsAyahsList({ path: { uuid: uuid } });

    return resp.data ?? [];
}