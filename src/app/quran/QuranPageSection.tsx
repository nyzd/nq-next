"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Container,
    RenderByScroll,
    Main,
    Screen,
} from "@yakad/ui";
import {
    FindBar,
    QuranPage,
} from "@/components";
import FooterWrapper from "./FooterWrapper";
import AppBarWrapper from "./AppBarWrapper";
import { Surah, AyahBreakersResponse, TranslationList } from "@ntq/sdk";
import { getSurahs } from "@/actions/getSurahs";
import { useStorage } from "@/contexts/storageContext";

interface QuranPageSectionProps {
    takhtitsAyahsBreakers: AyahBreakersResponse[];
    translation?: TranslationList;
}

function calculatePages(takhtitsAyahsBreakers: AyahBreakersResponse[]) {
    // Get unique page numbers from takhtits and sort them
    const rawUniquePages = Array.from(
        new Set(takhtitsAyahsBreakers.map(ayah => ayah.page).filter(Boolean))
    ).sort((a, b) => (a || 0) - (b || 0));

    // Detect whether takhtits already includes page 1
    const hasPage1InTakhtits = rawUniquePages.includes(1);

    // Build the pages list, ensuring page 1 exists at the beginning
    const uniquePages = hasPage1InTakhtits
        ? rawUniquePages
        : [1, ...rawUniquePages];

    // Calculate ayah range for each page
    return uniquePages.map(pageNumber => {
        if (pageNumber === 1) {
            // Hardcode page 1 data since it may not be in takhtits
            // For page 1, we need to get the first 7 ayahs from takhtitsAyahsBreakers
            const page1Ayahs = takhtitsAyahsBreakers.slice(0, 7);
            return {
                pageNumber: 1,
                ayahCount: 7, // Al-Fatihah has 7 ayahs
                offset: 0,
                limit: 7,
                ayahUUIDs: page1Ayahs.map(ayah => ayah.uuid)
            };
        }

        const pageAyahs = takhtitsAyahsBreakers.filter(ayah => ayah.page === pageNumber);
        const firstAyahIndex = takhtitsAyahsBreakers.findIndex(ayah => ayah.page === pageNumber);
        const lastAyahIndex = takhtitsAyahsBreakers.findLastIndex(ayah => ayah.page === pageNumber);

        // If takhtits does not include page 1, global offset should be shifted by 7
        const baseOffset = hasPage1InTakhtits ? 0 : 7;

        return {
            pageNumber: pageNumber!,
            ayahCount: pageAyahs.length,
            offset: firstAyahIndex + baseOffset,
            limit: lastAyahIndex - firstAyahIndex + 1,
            ayahUUIDs: pageAyahs.map(ayah => ayah.uuid)
        };
    });
}

export function QuranPageSection({ takhtitsAyahsBreakers, translation }: QuranPageSectionProps) {
    const { storage } = useStorage();
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [loadingInProgress, setLoadingInProgress] = useState(true);

    const calculated_pages = calculatePages(takhtitsAyahsBreakers);

    // Calculate the index for RenderByScroll based on selected ayah UUID
    const selectedAyahIndex = useMemo(() => {
        if (!storage.selected.ayahUUID) {
            return 0; // Default to first page if no ayah is selected
        }

        // Find which page contains the selected ayah UUID
        const pageIndex = calculated_pages.findIndex(page => 
            page.ayahUUIDs.includes(storage.selected.ayahUUID!)
        );

        return pageIndex >= 0 ? pageIndex : 0;
    }, [storage.selected.ayahUUID, calculated_pages]);

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
                    <FindBar
                        takhtitsAyahsBreakers={takhtitsAyahsBreakers}
                        surahs={surahs}
                    />

                    <RenderByScroll
                        scrollMarginTop={12}
                        jumpToIndex={selectedAyahIndex}
                        stopNewRenders={loadingInProgress}
                        newChildRendered={() => setLoadingInProgress(true)} 
                    >
                        {calculated_pages.map((page, index)=> (
                            <QuranPage key={index} onLoad={() => setLoadingInProgress(false)} index={0} page={page} mushaf="hafs" translation={translation} />
                        ))}
                    </RenderByScroll>
                </Container>
            </Main>
            <FooterWrapper />
        </Screen>
    );
}
