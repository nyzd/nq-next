"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Container,
    RenderByScroll,
    Main,
    Screen,
} from "@yakad/ui";
import {
    QuranPage,
} from "@/components";
import FooterWrapper from "./FooterWrapper";
import AppBarWrapper from "./AppBarWrapper";
import { Surah, AyahBreakersResponse } from "@ntq/sdk";
import { getSurahs } from "@/actions/getSurahs";
import { useSelected } from "@/contexts/selectedsContext";

interface QuranPageSectionProps {
    takhtitsAyahsBreakers: AyahBreakersResponse[];
}

function calculatePages(takhtitsAyahsBreakers: AyahBreakersResponse[]) {
    // Get unique page numbers from takhtits and sort them
    const uniquePages = Array.from(
        new Set(takhtitsAyahsBreakers.map(ayah => ayah.page).filter((p): p is number => !!p))
    ).sort((a, b) => a - b);

    // Calculate ayah range for each page directly from takhtits
    return uniquePages.map(pageNumber => {
        const pageAyahs = takhtitsAyahsBreakers.filter(ayah => ayah.page === pageNumber);
        const firstAyahIndex = takhtitsAyahsBreakers.findIndex(ayah => ayah.page === pageNumber);
        const lastAyahIndex = takhtitsAyahsBreakers.findLastIndex(ayah => ayah.page === pageNumber);

        return {
            pageNumber: pageNumber - 1,
            ayahCount: pageAyahs.length,
            offset: firstAyahIndex,
            limit: lastAyahIndex - firstAyahIndex + 1,
            ayahUUIDs: pageAyahs.map(ayah => ayah.uuid)
        };
    });
}

export function QuranPageSection({ takhtitsAyahsBreakers }: QuranPageSectionProps) {
    const [selected] = useSelected();
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [loadingInProgress, setLoadingInProgress] = useState(true);

    const calculated_pages = calculatePages(takhtitsAyahsBreakers);

    // Calculate the index for RenderByScroll based on selected ayah UUID
    const selectedAyahIndex = useMemo(() => {
        if (!selected.ayahUUID) {
            return 0; // Default to first page if no ayah is selected
        }

        // Find which page contains the selected ayah UUID
        const pageIndex = calculated_pages.findIndex(page => 
            page.ayahUUIDs.includes(selected.ayahUUID!)
        );

        return pageIndex >= 0 ? pageIndex : 0;
    }, [selected.ayahUUID, calculated_pages]);

    // Fetch surahs data for FindPopup
    useEffect(() => {
        getSurahs().then((surahs) => {
            setSurahs(surahs);
        }).catch((error) => {
            console.error("Error fetching surahs:", error);
            setSurahs([]);
        });
    }, []);


    return (
        <Screen>
            <AppBarWrapper />
            <Main>
                <Container size="md">

                    <RenderByScroll
                        scrollMarginTop={12}
                        jumpToIndex={selectedAyahIndex}
                        stopNewRenders={loadingInProgress}
                        newChildRendered={() => setLoadingInProgress(true)} 
                    >
                        {calculated_pages.map((page, index)=> (
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
                </Container>
            </Main>
            <FooterWrapper />
        </Screen>
    );
}
