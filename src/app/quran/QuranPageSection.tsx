"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Container,
    RenderByVisibility,
    Main,
    Screen,
    WithOverlay,
} from "@yakad/ui";
import {
    FindBar,
    FindPopup,
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
            return {
                pageNumber: 1,
                ayahCount: 7, // Al-Fatihah has 7 ayahs
                offset: 0,
                limit: 7
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
            limit: lastAyahIndex - firstAyahIndex + 1
        };
    });
}

export function QuranPageSection({ takhtitsAyahsBreakers, translation }: QuranPageSectionProps) {
    const { storage, setStorage } = useStorage();
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [loading, setLoading] = useState(true);

    const calculated_pages = calculatePages(takhtitsAyahsBreakers);
    console.log("pages", calculated_pages)

    // Fetch surahs data for FindPopup
    useEffect(() => {
        getSurahs().then((surahs) => {
            console.log('Loaded surahs:', surahs.length, 'First few:', surahs.slice(0, 3));
            setSurahs(surahs);
        }).catch((error) => {
            console.error("Error fetching surahs:", error);
            setSurahs([]);
        });
    }, []);

    // Get current selected ayah information
    const currentAyahInfo = useMemo(() => {
        if (!storage.selected.ayahUUID) {
            return {
                surahnumber: 1,
                ayahnumber: 1,
                pagenumber: 1,
                juz: 1,
                hizb: 1,
                surahName: "Al-Fatihah"
            };
        }

        const currentAyah = takhtitsAyahsBreakers.find(
            ayah => ayah.uuid === storage.selected.ayahUUID
        );

        if (!currentAyah) {
            return {
                surahnumber: 1,
                ayahnumber: 1,
                pagenumber: 1,
                juz: 1,
                hizb: 1,
                surahName: "Al-Fatihah"
            };
        }

        const surah = surahs.find(s => s.number === currentAyah.surah);
        const surahName = surah ? (surah.names?.[0]?.name || `Surah ${currentAyah.surah}`) : `Surah ${currentAyah.surah}`;
        
        // Debug logging
        console.log('Current ayah:', currentAyah.surah, 'Surah found:', surah, 'Surah name:', surahName);

        return {
            surahnumber: currentAyah.surah,
            ayahnumber: currentAyah.ayah,
            pagenumber: currentAyah.page || 1,
            juz: currentAyah.juz || 1,
            hizb: currentAyah.hizb || 1,
            surahName: surahName
        };
    }, [storage.selected.ayahUUID, takhtitsAyahsBreakers, surahs]);

    return (
        <Screen>
            <AppBarWrapper />
            <Main>
                <Container size="md">
                    <WithOverlay overlay={
                        <FindPopup
                            heading="Find"
                            onButtonClicked={(surahNum, ayahNum) => {
                                // Find the ayah in takhtitsAyahsBreakers by surah and ayah number
                                const targetAyah = takhtitsAyahsBreakers.find(
                                    ayah => ayah.surah === surahNum && ayah.ayah === ayahNum
                                );

                                if (targetAyah && targetAyah.uuid) {
                                    // Update localStorage with the selected ayah UUID
                                    setStorage(prev => ({
                                        ...prev,
                                        selected: {
                                            ...prev.selected,
                                            ayahUUID: targetAyah.uuid
                                        }
                                    }));
                                }
                            }}
                            surahs={surahs}
                            takhtitsAyahsBreakers={takhtitsAyahsBreakers}
                        />
                    }>
                        <FindBar
                            surahnumber={currentAyahInfo.surahnumber}
                            ayahnumber={currentAyahInfo.ayahnumber}
                            pagenumber={currentAyahInfo.pagenumber}
                            juz={currentAyahInfo.juz}
                            hizb={currentAyahInfo.hizb}
                            surahName={currentAyahInfo.surahName}
                        />
                    </WithOverlay>

                    {/* <QuranPages 
                        takhtitsAyahsBreakers={takhtitsAyahsBreakers}
                        mushaf="hafs"
                        translation={translation}
                    /> */}
                    {/* <QuranPage index={0} pages={calculated_pages} mushaf="hafs"/> */}
                    <RenderByVisibility
                        stopRendering={loading}
                        newChildRendered={() => setLoading(true)} 
                    >
                        {calculated_pages.map((page, index)=> (
                            <QuranPage key={index} onLoad={() => setLoading(false)} index={0} page={page} mushaf="hafs" translation={translation} />
                        ))}
                    </RenderByVisibility>
                </Container>
            </Main>
            <FooterWrapper />
        </Screen>
    );
}
