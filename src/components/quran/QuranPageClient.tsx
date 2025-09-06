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
import { useRouter } from "next/navigation";
import { Surah, AyahBreakersResponse } from "@ntq/sdk";
import { getSurahs } from "@/actions/getSurahs";
import { List, WindowScroller } from "react-virtualized";

interface QuranPageClientProps {
    takhtitsAyahsBreakers: AyahBreakersResponse[];
}

export function QuranPageClient({ takhtitsAyahsBreakers }: QuranPageClientProps) {
    const router = useRouter();
    const [isFindPopupVisible, setIsFindPopupVisible] = useState<boolean>(false);
    const [isMorePopupVisible, setIsMorePopupVisible] = useState<boolean>(false);
    const [surahs, setSurahs] = useState<Surah[]>([]);

    // Fetch surahs data once on component mount
    useEffect(() => {
        getSurahs().then((surahs) => {
            setSurahs(surahs);
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
                    onButtonClicked={(a) => {
                        // Find the ayah in takhtitsAyahsBreakers by index
                        if (takhtitsAyahsBreakers[a] && takhtitsAyahsBreakers[a].uuid) {
                            router.push(`#ayah-${takhtitsAyahsBreakers[a].uuid}`);
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
