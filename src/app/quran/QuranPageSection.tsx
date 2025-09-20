"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Container,
    Main,
    Screen,
} from "@yakad/ui";
import {
    FindBar,
    FindPopup,
    MorePopup,
} from "@/components";
import FooterWrapper from "./FooterWrapper";
import AppBarWrapper from "./AppBarWrapper";
import { Surah, AyahBreakersResponse, TranslationList } from "@ntq/sdk";
import { getSurahs } from "@/actions/getSurahs";
import { useStorage } from "@/contexts/storageContext";
import { QuranPages } from "./QuranPages";

interface QuranPageSectionProps {
    takhtitsAyahsBreakers: AyahBreakersResponse[];
    translation?: TranslationList;
}

export function QuranPageSection({ takhtitsAyahsBreakers, translation }: QuranPageSectionProps) {
    const { storage, setStorage } = useStorage();
    const [isFindPopupVisible, setIsFindPopupVisible] = useState<boolean>(false);
    const [isMorePopupVisible, setIsMorePopupVisible] = useState<boolean>(false);
    const [surahs, setSurahs] = useState<Surah[]>([]);

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
                    <FindBar
                        surahnumber={currentAyahInfo.surahnumber}
                        ayahnumber={currentAyahInfo.ayahnumber}
                        pagenumber={currentAyahInfo.pagenumber}
                        juz={currentAyahInfo.juz}
                        hizb={currentAyahInfo.hizb}
                        surahName={currentAyahInfo.surahName}
                        onClick={() => setIsFindPopupVisible(true)}
                    />

                    <QuranPages 
                        takhtitsAyahsBreakers={takhtitsAyahsBreakers}
                        mushaf="hafs"
                        translation={translation}
                    />
                </Container>
            </Main>
            <FooterWrapper />
            {isFindPopupVisible && (
                <FindPopup
                    heading="Find"
                    onclosebuttonclick={() => setIsFindPopupVisible(false)}
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
                        setIsFindPopupVisible(false);
                    }}
                    surahs={surahs}
                    takhtitsAyahsBreakers={takhtitsAyahsBreakers}
                />
            )}
            {isMorePopupVisible && (
                <MorePopup
                    heading=""
                    onclosebuttonclick={() => setIsMorePopupVisible(false)}
                />
            )}
        </Screen>
    );
}
