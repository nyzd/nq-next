"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    Container,
    Main,
    Row,
    Screen,
    Spacer,
    H2,
    P,
    Text,
    Loading,
} from "@yakad/ui";
import {
    Ayah,
    FindBar,
    FindPopup,
    MorePopup,
    PageDivider,
    SurahPeriodIcon,
} from "@/components";
import FooterWrapper from "./FooterWrapper";
import AppBarWrapper from "./AppBarWrapper";
import { useRouter } from "next/navigation";
import { AyahBreakersResponse, Ayah as AyahType } from "@ntq/sdk";
import { getTakhtits, getTakhtitsAyahsBreakers } from "@/actions/getTakhtits";
import { getAyahs } from "@/actions/getAyahs";

const LIMIT = 30;

interface AyahTypeWithSurahNumber extends AyahType {
    surahNumber: number;
}

export default function Page () {
    const router = useRouter();
    const [isFindPopupVisible, setIsFindPopupVisible] =
        useState<boolean>(false);
    const [isMorePopupVisible, setIsMorePopupVisible] =
        useState<boolean>(false);

    const [ayahs, setAyahs] = useState<AyahTypeWithSurahNumber[]>([]);
    const [offset, setOffset] = useState(1);
    const [limit, setLimit] = useState(LIMIT);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [takhtitsAyahsBreakersMap, setTakhtitsAyahsBreakersMap] = useState<Map<string, number>>(new Map());
    const loaderRef = useRef(null);

    // Fetch takhtits data once on component mount
    useEffect(() => {
        const fetchTakhtits = async () => {
            try {
                const firstTakhtit = await getTakhtits();
                const firstTakhtitUuid = firstTakhtit[1].uuid;

                const res = await getTakhtitsAyahsBreakers(firstTakhtitUuid);
                const map = new Map();
                res.forEach((ayah) => {
                    const key = `${ayah.surah}-${ayah.ayah}`;
                    map.set(key, ayah.page);
                });
                setTakhtitsAyahsBreakersMap(map);
            } catch (err) {
                console.error(err);
            }
        };

        fetchTakhtits();
    }, []);

    useEffect(() => {
        if (!loaderRef.current || !hasMore || isLoading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setOffset(prev => prev + LIMIT);
                    setLimit(prev => prev + LIMIT);
                }
            },
            { threshold: 1 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasMore, isLoading]);

    const fetchItems = useCallback(async () => {
        if (isLoading) return;
        
        setIsLoading(true);
        try {
            const ayahs = await getAyahs("hafs", limit, offset);
            let currentSurahNumber = 1;

            const finalAyahs: AyahTypeWithSurahNumber[] = [];
            for (const ayah of ayahs) {
                if (ayah.number === 1) {
                    currentSurahNumber = (ayah.surah as any).number;
                }

                finalAyahs.push({
                    ...ayah,
                    surahNumber: currentSurahNumber,
                });
            }

            if (finalAyahs.length === 0) {
                setHasMore(false);
            } else {
                setAyahs(prev => [...prev, ...finalAyahs]);
            }
        } catch (error) {
            console.error("Error fetching ayahs:", error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [limit, offset, isLoading]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const getPageNumber = (ayahNumber: number, surahNumber: number) => {
        const key = `${surahNumber}-${ayahNumber}`;
        return takhtitsAyahsBreakersMap.get(key);
    };

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

                    {takhtitsAyahsBreakersMap.size > 0 && ayahs.map((ayah, index) => (
                        <div key={`${ayah.surahNumber}-${ayah.number}-${index}`}>
                            {(() => {
                                const pageNumber = getPageNumber(ayah.number, ayah.surahNumber);
                                return pageNumber ? (
                                    <PageDivider pagenumber={pageNumber} />
                                ) : null;
                            })()}
                            <Ayah
                                number={ayah.number}
                                text={ayah.text}
                            />
                        </div>
                    ))}

                    {hasMore && <Loading ref={loaderRef} variant="dots" />}
                    {!hasMore && ayahs.length > 0 && <p>No more items</p>}
                </Container>
            </Main>
            <FooterWrapper />
            {isFindPopupVisible && (
                <FindPopup
                    heading="Find"
                    onclosebuttonclick={() => setIsFindPopupVisible(false)}
                    onButtonClicked={(a) => {
                        if (ayahs[a] && ayahs[a].uuid) {
                            router.push(`#ayah-${ayahs[a].uuid}`);
                        }
                        setIsFindPopupVisible(false);
                    }}
                    ayahs_numbers={ayahs.map((ayah) => ayah.number)}
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
};
