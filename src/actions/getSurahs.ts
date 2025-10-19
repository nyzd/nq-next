"use server";

import { surahsList } from "@ntq/sdk";

export async function getSurahs(mushaf: "hafs" | string) {
    // TODO: remove as
    return (await surahsList({query: { mushaf: mushaf as "hafs" }})).data || [];
}