"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loading, P, Container, Row, H2, Spacer } from "@yakad/ui";
import { Ayah, PageDivider, SurahPeriodIcon } from "@/components";
import { AyahBreakersResponse, Ayah as AyahType, Surah } from "@ntq/sdk";
import { getAyahsBySurah } from "@/actions/getAyahs";

interface AyahsClientProps {
    takhtitsAyahsBreakers: AyahBreakersResponse[];
    surahs: Surah[];
}

interface AyahTypeWithSurahNumber extends AyahType {
    surahNumber: number;
}

export function AyahsClient({ takhtitsAyahsBreakers, surahs }: AyahsClientProps) {
    const [loadedAyahTexts, setLoadedAyahTexts] = useState<Map<string, AyahType>>(new Map());
    const [loadingAyahs, setLoadingAyahs] = useState<Set<string>>(new Set());
    const loadedAyahTextsRef = useRef<Map<string, AyahType>>(new Map());
    const loadingAyahsRef = useRef<Set<string>>(new Set());
    const takhtitRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    // Update refs when state changes
    useEffect(() => {
        loadedAyahTextsRef.current = loadedAyahTexts;
    }, [loadedAyahTexts]);

    useEffect(() => {
        loadingAyahsRef.current = loadingAyahs;
    }, [loadingAyahs]);

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
        <>
            {takhtitsAyahsBreakers.map((ayah, index) => {
                const key = `${ayah.surah}-${ayah.ayah}`;
                const loadedAyah = loadedAyahTexts.get(key);
                const isLoading = loadingAyahs.has(key);
                
                // Check if this is the first ayah or if the page number has changed
                const isNewPage = index === 0 || 
                    (ayah.page && takhtitsAyahsBreakers[index - 1]?.page !== ayah.page);
                
                return (
                    <div key={key}>
                        {isNewPage && ayah.page && <PageDivider pagenumber={ayah.page} />}
                        <div 
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
                                <div>
                                    {
                                        loadedAyah.surah && (
                                            <Container size="sm" align="center">
                                                <Row>
                                                    <SurahPeriodIcon variant="filled" period={(loadedAyah.surah as any).period || "Not Found!"} />
                                                    <H2 title="Surah name" variant="heading6">
                                                    {(loadedAyah.surah as any).names[0].name}
                                                    </H2>
                                                    <Spacer />
                                                        <P variant="heading6">{(loadedAyah.surah as any).number_of_ayahs} Ayahs</P>
                                                </Row>
                                                <P variant="body1">{(loadedAyah.surah as any).bismillah.is_ayah ? loadedAyah.text : (loadedAyah.surah as any).bismillah.text}</P>
                                            </Container>
                                        )
                                    }
                                    {
                                        (!loadedAyah.surah || !((loadedAyah.surah as any).bismillah?.is_ayah)) && (
                                            <Ayah
                                                number={loadedAyah.number}
                                                text={loadedAyah.text}
                                                sajdah={loadedAyah.sajdah}
                                            />
                                        )
                                    }
                                </div>
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
                    </div>
                );
            })}
        </>
    );
}
