"use client";

import { useEffect, useState } from "react";
import {
    Container,
    Main,
    Screen,
} from "@yakad/ui";
import {
    FindBar,
    FindPopup,
    MorePopup,
    AyahsClient,
} from "@/components";
import FooterWrapper from "../../app/quran/FooterWrapper";
import AppBarWrapper from "../../app/quran/AppBarWrapper";
import { Surah, AyahBreakersResponse } from "@ntq/sdk";
import { getSurahs } from "@/actions/getSurahs";
import { useStorage } from "@/contexts/storageContext";

interface QuranPageClientProps {
    takhtitsAyahsBreakers: AyahBreakersResponse[];
}

export function QuranPageClient({ takhtitsAyahsBreakers }: QuranPageClientProps) {
    const { setStorage } = useStorage();
    const [isFindPopupVisible, setIsFindPopupVisible] = useState<boolean>(false);
    const [isMorePopupVisible, setIsMorePopupVisible] = useState<boolean>(false);
    const [surahs, setSurahs] = useState<Surah[]>([]);

    // Fetch surahs data once on component mount
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
                        surahnumber={1}
                        ayahnumber={1}
                        pagenumber={1}
                        juz={1}
                        hizb={2}
                        onClick={() => setIsFindPopupVisible(true)}
                    />

                    <AyahsClient 
                        takhtitsAyahsBreakers={takhtitsAyahsBreakers}
                        surahs={surahs}
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
