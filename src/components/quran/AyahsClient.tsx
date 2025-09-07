"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loading, P, Container, Row, H2, Spacer } from "@yakad/ui";
import { Ayah, PageDivider, SurahPeriodIcon } from "@/components";
import { AyahBreakersResponse, Ayah as AyahType, Surah } from "@ntq/sdk";
import { getAyahsBySurah } from "@/actions/getAyahs";
import { List, AutoSizer } from "react-virtualized";
import { useStorage } from "@/contexts/storageContext";

interface AyahsClientProps {
    takhtitsAyahsBreakers: AyahBreakersResponse[];
    surahs: Surah[];
}


export function AyahsClient({ takhtitsAyahsBreakers, surahs }: AyahsClientProps) {
    const { storage } = useStorage();
    const [loadedAyahTexts, setLoadedAyahTexts] = useState<Map<string, AyahType>>(new Map());
    const [loadingAyahs, setLoadingAyahs] = useState<Set<string>>(new Set());
    const loadedAyahTextsRef = useRef<Map<string, AyahType>>(new Map());
    const loadingAyahsRef = useRef<Set<string>>(new Set());
    const listRef = useRef<List>(null);

    // Update refs when state changes
    useEffect(() => {
        loadedAyahTextsRef.current = loadedAyahTexts;
    }, [loadedAyahTexts]);

    useEffect(() => {
        loadingAyahsRef.current = loadingAyahs;
    }, [loadingAyahs]);

    // Listen for storage changes and scroll to selected ayah
    useEffect(() => {
        if (storage.selected.ayahUUID && listRef.current) {
            // Find the index of the ayah with the selected UUID
            const ayahIndex = takhtitsAyahsBreakers.findIndex(
                ayah => ayah.uuid === storage.selected.ayahUUID
            );
            
            if (ayahIndex !== -1) {
                // Add a small delay to ensure the list is fully rendered
                setTimeout(() => {
                    listRef.current?.scrollToRow(ayahIndex);
                }, 100);
            }
        }
    }, [storage.selected.ayahUUID, takhtitsAyahsBreakers]);

    const loadVisibleAyahs = useCallback(async (visibleKeys: string[]) => {
        // Don't load ayahs if surahs are not yet loaded
        if (surahs.length === 0) {
            return;
        }

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

    // Handle visible rows change for lazy loading
    const handleRowsRendered = useCallback(({ startIndex, stopIndex }: { startIndex: number; stopIndex: number }) => {
        // Add some buffer around visible rows for smoother loading
        const buffer = 5;
        const start = Math.max(0, startIndex - buffer);
        const end = Math.min(takhtitsAyahsBreakers.length - 1, stopIndex + buffer);
        
        // Generate keys for visible ayahs
        const visibleKeys: string[] = [];
        for (let i = start; i <= end; i++) {
            const ayah = takhtitsAyahsBreakers[i];
            if (ayah) {
                visibleKeys.push(`${ayah.surah}-${ayah.ayah}`);
            }
        }
        
        // Load visible ayahs
        if (visibleKeys.length > 0) {
            loadVisibleAyahs(visibleKeys);
        }
    }, [takhtitsAyahsBreakers, loadVisibleAyahs]);

    // Row renderer for the virtualized list
    const rowRenderer = useCallback(({ index, key, style }: { index: number; key: string; style: React.CSSProperties }) => {
        const ayah = takhtitsAyahsBreakers[index];
        const ayahKey = `${ayah.surah}-${ayah.ayah}`;
        const loadedAyah = loadedAyahTexts.get(ayahKey);
        const isLoading = loadingAyahs.has(ayahKey);
        
        // Check if this is the first ayah or if the page number has changed
        const isNewPage = index === 0 || 
            (ayah.page && takhtitsAyahsBreakers[index - 1]?.page !== ayah.page);

        return (
            <div key={key} style={style}>
                {isNewPage && ayah.page && <PageDivider pagenumber={ayah.page} />}
                <div 
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
                                            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                            {/* @ts-ignore */}  
                                            <SurahPeriodIcon variant="filled" period={loadedAyah.surah?.period || "Not Found!"} />
                                            <H2 title="Surah name" variant="heading6">
                                            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                            {/* @ts-ignore */}
                                            {loadedAyah.surah?.names[0]}
                                            </H2>
                                            <Spacer />
                                            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                            {/* @ts-ignore */}
                                                <P variant="heading6">{loadedAyah.surah?.number_of_ayahs} Ayahs</P>
                                        </Row>
                                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                        {/* @ts-ignore */}
                                        <P variant="body1">{loadedAyah.surah?.bismillah?.is_ayah ? loadedAyah.text : loadedAyah.surah?.bismillah?.text}</P>
                                    </Container>
                                )
                            }
                            {
                                /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                                /* @ts-ignore */
                                (!loadedAyah.surah || !(loadedAyah.surah?.bismillah?.is_ayah)) && (
                                    <Ayah
                                        number={loadedAyah.number}
                                        text={loadedAyah.text}
                                        sajdah={loadedAyah.sajdah || "none"}
                                    />
                                )
                            }
                        </div>
                    ) : (
                        <div style={{ 
                            padding: '1rem', 
                            border: '1px dashed #ccc', 
                            textAlign: 'center',
                            color: '#666',
                        }}>
                            Takhtit - Surah {ayah.surah}, Ayah {ayah.ayah} (Page {ayah.page})
                        </div>
                    )}
                </div>
            </div>
        );
    }, [takhtitsAyahsBreakers, loadedAyahTexts, loadingAyahs]);

    // Show loading state if surahs are not yet loaded
    if (surahs.length === 0) {
        return (
            <div style={{ 
                height: '100vh', 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
            }}>
                <Loading variant="dots" />
            </div>
        );
    }

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        ref={listRef}
                        height={height}
                        width={width}
                        rowCount={takhtitsAyahsBreakers.length}
                        rowHeight={200} // Estimated height per row
                        rowRenderer={rowRenderer}
                        onRowsRendered={handleRowsRendered}
                        overscanRowCount={5} // Render 5 extra rows for smooth scrolling
                    />
                )}
            </AutoSizer>
        </div>
    );
}
