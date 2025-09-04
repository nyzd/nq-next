"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
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
import { AyahBreakersResponse, Ayah as AyahType, Surah, surahsList } from "@ntq/sdk";
import { getTakhtits, getTakhtitsAyahsBreakers } from "@/actions/getTakhtits";
import { getAyahs, getAyahsBySurah } from "@/actions/getAyahs";
import { getSurahs } from "@/actions/getSurahs";

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

    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [ayahs, setAyahs] = useState<AyahTypeWithSurahNumber[]>([]);
    const [offset, setOffset] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [takhtitsAyahsBreakers, setTakhtitsAyahsBreakers] = useState<AyahBreakersResponse[]>([]);
    const [takhtitsAyahsBreakersMap, setTakhtitsAyahsBreakersMap] = useState<Map<string, number>>(new Map());
    const [loadedAyahTexts, setLoadedAyahTexts] = useState<Map<string, AyahType>>(new Map());
    const [loadingAyahs, setLoadingAyahs] = useState<Set<string>>(new Set());
    const loadedAyahTextsRef = useRef<Map<string, AyahType>>(new Map());
    const loadingAyahsRef = useRef<Set<string>>(new Set());
    const loaderRef = useRef(null);
    const takhtitRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    // Fetch takhtits data once on component mount
    useEffect(() => {
        const fetchTakhtits = async () => {
            try {
                const firstTakhtit = await getTakhtits();
                const firstTakhtitUuid = firstTakhtit[0].uuid;

                const res = await getTakhtitsAyahsBreakers(firstTakhtitUuid);
                setTakhtitsAyahsBreakers(res);
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

        getSurahs().then((surahs) => {
            setSurahs(surahs);
        });
    }, []);

    useEffect(() => {
        if (!loaderRef.current || !hasMore || isLoading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setOffset(prev => prev + LIMIT);
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
            const ayahs = await getAyahs("hafs", LIMIT, offset);
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
    }, [offset]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // Update loadedAyahTexts when new ayahs are loaded
    useEffect(() => {
        setLoadedAyahTexts(prev => {
            const newLoadedTexts = new Map(prev);
            let hasUpdates = false;

            ayahs.forEach(ayah => {
                const key = `${ayah.surahNumber}-${ayah.number}`;
                if (!newLoadedTexts.has(key)) {
                    newLoadedTexts.set(key, ayah);
                    hasUpdates = true;
                }
            });

            const result = hasUpdates ? newLoadedTexts : prev;
            loadedAyahTextsRef.current = result;
            return result;
        });
    }, [ayahs]);

    // Update refs when state changes
    useEffect(() => {
        loadedAyahTextsRef.current = loadedAyahTexts;
    }, [loadedAyahTexts]);

    useEffect(() => {
        loadingAyahsRef.current = loadingAyahs;
    }, [loadingAyahs]);

    const getPageNumber = (ayahNumber: number, surahNumber: number) => {
        const key = `${surahNumber}-${ayahNumber}`;
        return takhtitsAyahsBreakersMap.get(key);
    };

    const loadAyahText = useCallback(async (surahNumber: number, ayahNumber: number) => {
        const key = `${surahNumber}-${ayahNumber}`;
        
        // Don't load if already loaded or currently loading
        if (loadedAyahTextsRef.current.has(key) || loadingAyahsRef.current.has(key)) {
            return;
        }

        // First check if the ayah is already available in the existing ayahs state
        const existingAyah = ayahs.find(ayah => 
            ayah.surahNumber === surahNumber && ayah.number === ayahNumber
        );

        if (existingAyah) {
            // Use the existing ayah data
            setLoadedAyahTexts(prev => new Map(prev).set(key, existingAyah));
            return;
        }

        setLoadingAyahs(prev => new Set(prev).add(key));

        try {
            // Find the surah UUID from the surahs list
            const surah = surahs.find(s => s.number === surahNumber);
            if (!surah) {
                console.error(`Surah ${surahNumber} not found`);
                return;
            }

            // Get ayahs for this surah starting from the specific ayah number
            const ayahs = await getAyahsBySurah("hafs", surah.uuid, 1, ayahNumber - 1);
            
            if (ayahs.length > 0) {
                const ayah = ayahs[0];
                setLoadedAyahTexts(prev => new Map(prev).set(key, ayah));
            }
        } catch (error) {
            console.error(`Error loading ayah ${surahNumber}:${ayahNumber}:`, error);
        } finally {
            setLoadingAyahs(prev => {
                const newSet = new Set(prev);
                newSet.delete(key);
                return newSet;
            });
        }
    }, [ayahs, surahs]);

    const loadVisibleAyahs = useCallback(async (visibleKeys: string[]) => {
        // Filter out already loaded or currently loading ayahs
        const keysToLoad = visibleKeys.filter(key => 
            !loadedAyahTextsRef.current.has(key) && !loadingAyahsRef.current.has(key)
        );

        if (keysToLoad.length === 0) return;

        // Mark all as loading
        setLoadingAyahs(prev => {
            const newSet = new Set(prev);
            keysToLoad.forEach(key => newSet.add(key));
            return newSet;
        });

        try {
            // Group ayahs by surah for batch loading
            const surahGroups = new Map<number, number[]>();
            
            keysToLoad.forEach(key => {
                const [surahNumber, ayahNumber] = key.split('-').map(Number);
                if (!surahGroups.has(surahNumber)) {
                    surahGroups.set(surahNumber, []);
                }
                surahGroups.get(surahNumber)!.push(ayahNumber);
            });

            // Load ayahs for each surah
            const loadPromises = Array.from(surahGroups.entries()).map(async ([surahNumber, ayahNumbers]) => {
                const surah = surahs.find(s => s.number === surahNumber);
                if (!surah) {
                    console.error(`Surah ${surahNumber} not found`);
                    return;
                }

                // Get the range of ayahs to load
                const minAyah = Math.min(...ayahNumbers);
                const maxAyah = Math.max(...ayahNumbers);
                const count = maxAyah - minAyah + 1;

                try {
                    const ayahs = await getAyahsBySurah("hafs", surah.uuid, count, minAyah - 1);
                    
                    // Map the loaded ayahs to their keys
                    ayahs.forEach(ayah => {
                        const key = `${surahNumber}-${ayah.number}`;
                        if (keysToLoad.includes(key)) {
                            setLoadedAyahTexts(prev => new Map(prev).set(key, ayah));
                        }
                    });
                } catch (error) {
                    console.error(`Error loading ayahs for surah ${surahNumber}:`, error);
                }
            });

            await Promise.all(loadPromises);
        } catch (error) {
            console.error('Error in batch loading ayahs:', error);
        } finally {
            // Remove from loading state
            setLoadingAyahs(prev => {
                const newSet = new Set(prev);
                keysToLoad.forEach(key => newSet.delete(key));
                return newSet;
            });
        }
    }, [surahs]);

    // Intersection observer for takhtit breakers
    useEffect(() => {
        let visibleKeys: string[] = [];
        let debounceTimer: NodeJS.Timeout;

        const observer = new IntersectionObserver(
            (entries) => {
                // Collect all visible keys
                const newVisibleKeys: string[] = [];
                
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const key = entry.target.getAttribute('data-takhtit-key');
                        if (key) {
                            newVisibleKeys.push(key);
                        }
                    }
                });

                // Update visible keys
                visibleKeys = [...new Set([...visibleKeys, ...newVisibleKeys])];

                // Debounce the loading to avoid too many requests
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    if (visibleKeys.length > 0) {
                        loadVisibleAyahs(visibleKeys);
                    }
                }, 100);
            },
            { threshold: 0.1, rootMargin: '200px' }
        );

        // Observe all takhtit elements
        takhtitRefs.current.forEach((element) => {
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
            clearTimeout(debounceTimer);
        };
    }, [takhtitsAyahsBreakers, loadVisibleAyahs]);

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

                    {takhtitsAyahsBreakers.map(ayah => {
                        const key = `${ayah.surah}-${ayah.ayah}`;
                        const loadedAyah = loadedAyahTexts.get(key);
                        const isLoading = loadingAyahs.has(key);
                        
                        return (
                            <div 
                                key={key}
                                ref={(el) => {
                                    if (el) {
                                        takhtitRefs.current.set(key, el);
                                    }
                                }}
                                data-takhtit-key={key}
                                style={{ marginBottom: '1rem' }}
                                id={`ayah-${ayah.uuid}`}
                            >
                                {isLoading ? (
                                    <div style={{ padding: '1rem', textAlign: 'center' }}>
                                        <Loading variant="dots" />
                                    </div>
                                ) : loadedAyah ? (
                                    <Ayah
                                        number={loadedAyah.number}
                                        text={loadedAyah.text}
                                        sajdah={loadedAyah.sajdah}
                                    />
                                ) : (
                                    <div style={{ 
                                        padding: '1rem', 
                                        border: '1px dashed #ccc', 
                                        textAlign: 'center',
                                        color: '#666'
                                    }}>
                                        Takhtit - Surah {ayah.surah}, Ayah {ayah.ayah} (Page {ayah.page})
                                    </div>
                                )}
                            </div>
                        );
                    })}

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
};
