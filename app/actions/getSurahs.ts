"use server";

import { surahsList } from "@ntq/sdk";

export async function getSurahs(mushaf: "hafs" | string) {
    // TODO: remove as
    const response = await surahsList({query: { mushaf: mushaf as "hafs" }});

    if (!response.data) throw new Error("Error when getting Surahs list!")

    return response.data;
}