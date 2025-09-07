import React from "react";
import { getSurahs } from "@/actions/getSurahs";
import { SearchPageClient } from "./SearchPageClient";

export default async function Page() {
    const surahList = await getSurahs();

    return <SearchPageClient initialSurahList={surahList} />;
}
