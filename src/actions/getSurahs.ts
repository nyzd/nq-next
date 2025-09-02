"use server";

import { surahsList } from "@ntq/sdk";

export async function getSurahs() {
    return (await surahsList({query: { mushaf: "hafs" }})).data || [];
}