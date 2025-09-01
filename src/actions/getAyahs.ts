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

    return response.data ?? [];
}