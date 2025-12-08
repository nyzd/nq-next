"use server";

import { Ayah, ayahsList } from "@ntq/sdk";

export async function getAyahs(
    mushaf: string,
    limit: number,
    offset: number = 0,
): Promise<{ data: Ayah[], error: Error | undefined }> {
    const response = await ayahsList({
        params: {
            mushaf: mushaf,
        },
        query: {
            limit: limit,
            offset: offset,
        },
    });

    if (!response.data)
        return {
            data: [],
            error: new Error(
                `Error when getting Ayahs list, status: ${response.status}, msg: ${response.data}, res: ${response}`
            )
        };

    return { data: response.data, error: undefined };
}

export async function getAyahsBySurah(
    mushaf: string,
    surahUuid: string,
    limit: number = 1,
    offset: number = 0
): Promise<Ayah[]> {
    const response = await ayahsList({
        params: {
            mushaf: mushaf,
        },
        query: {
            surah_uuid: surahUuid,
            limit: limit,
            offset: offset,
        },
    });

    if (!response.data)
        throw Error(
            `Error when Ayahs list by surah, status: ${response.status}, msg: ${response.data}`
        );

    return response.data;
}
