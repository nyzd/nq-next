"use client";

// import { useSelected } from "@/contexts/selectedsContext";
import { useMemo, useState } from "react";
import { CalculatedPage } from "./Mushaf";
import { RenderByScroll } from "@/components/renderByScroll/RenderByScroll";
// import { QuranPage } from "../page/QuranPage";
import { AyahBreakersResponse, Surah } from "@ntq/sdk";
import { QuranPage } from "./page/QuranPage";

export function MushafClient({
    calculated_pages,
    takhtitsAyahsBreakers,
    surahs,
}: {
    calculated_pages: CalculatedPage[];
    takhtitsAyahsBreakers: AyahBreakersResponse[];
    surahs: Surah[];
}) {
    const selected: { ayahUUID: string } = { ayahUUID: "" }; // TODO
    const [loadingInProgress, setLoadingInProgress] = useState(true);
    // Calculate the index for RenderByScroll based on selected ayah UUID
    const selectedAyahIndex = useMemo(() => {
        if (!selected.ayahUUID) {
            return 0; // Default to first page if no ayah is selected
        }

        // Find which page contains the selected ayah UUID
        const pageIndex = calculated_pages.findIndex((page) =>
            page.ayahUUIDs.includes(selected.ayahUUID!)
        );

        return pageIndex >= 0 ? pageIndex : 0;
    }, [selected.ayahUUID, calculated_pages]);
    return (
        <RenderByScroll
            scrollMarginTop={12}
            jumpToIndex={selectedAyahIndex}
            stopNewRenders={loadingInProgress}
            newChildRendered={() => setLoadingInProgress(true)}
            className="flex flex-col gap-5 max-w-2xl"
        >
            {calculated_pages.map((page, index) => (
                <QuranPage
                    key={index}
                    onLoad={() => setLoadingInProgress(false)}
                    index={0}
                    page={page}
                    mushaf="hafs"
                    takhtitsAyahsBreakers={takhtitsAyahsBreakers}
                    surahs={surahs}
                />
            ))}
        </RenderByScroll>
    );
}
