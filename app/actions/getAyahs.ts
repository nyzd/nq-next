'use server';

import { Ayah, ayahsList } from "@ntq/sdk";

export async function getAyahs(mushaf: string, limit: number, offset: number = 0): Promise<Ayah[]> {
    const response = await ayahsList({
        params: {
            mushaf: mushaf,
        },
        query: {
            limit: limit,
            offset: offset
        }
    });

    if (!response.data) throw Error("Error when Ayahs list");

    return response.data;
}

export async function getAyahsBySurah(mushaf: string, surahUuid: string, limit: number = 1, offset: number = 0): Promise<Ayah[]> {
    const response = await ayahsList({
        params: {
            mushaf: mushaf,
        },
        query: {
            surah_uuid: surahUuid,
            limit: limit,
            offset: offset
        }
    });

    if (!response.data) throw Error("Error when Ayahs list by surah");

    return response.data;
}