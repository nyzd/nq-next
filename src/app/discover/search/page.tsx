import React from "react";
import { getSurahs } from "@/actions/getSurahs";
import { SearchPageClient } from "./SearchPageClient";

export default async function Page() {
    const surahList = await getSurahs("hafs");

    return <SearchPageClient initialSurahList={surahList} />;
}
