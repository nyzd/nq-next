"use client";

import { forwardRef, useState, useMemo, useEffect } from "react";
import { Button, InputField, Row, Select, Text } from "@yakad/ui";
import { Xpopup, XpopupProps } from "@yakad/x";
import { Surah, AyahBreakersResponse } from "@ntq/sdk";
import { useStorage } from "@/contexts/storageContext";

interface FindPopupProps extends XpopupProps {
    surahs: Surah[];
    takhtitsAyahsBreakers: AyahBreakersResponse[];
    onButtonClicked: (surah_num: number, ayah_num: number) => void;
}

export const FindPopup = forwardRef<HTMLDivElement, FindPopupProps>(
    function FindPopup({ surahs, takhtitsAyahsBreakers, onButtonClicked, ...restProps }, ref) {
        const { storage } = useStorage();
        const [currentSurah, setCurrentSurah] = useState<number>();
        const [currentAyah, setCurrentAyah] = useState<number>();
        const [currentJuz, setCurrentJuz] = useState<number>();
        const [currentHizb, setCurrentHizb] = useState<number>();
        const [currentRuku, setCurrentRuku] = useState<number>();
        const [currentPage, setCurrentPage] = useState<number>();

        // Find current ayah from localStorage and set initial state
        useEffect(() => {
            if (storage.selected.ayahUUID && takhtitsAyahsBreakers.length > 0) {
                const currentAyahData = takhtitsAyahsBreakers.find(
                    ayah => ayah.uuid === storage.selected.ayahUUID
                );
                
                if (currentAyahData) {
                    setCurrentSurah(currentAyahData.surah);
                    setCurrentAyah(currentAyahData.ayah);
                    setCurrentPage(currentAyahData.page || undefined);
                    
                    // Set juz if available in the data
                    if (currentAyahData.juz) {
                        setCurrentJuz(currentAyahData.juz);
                    }
                    
                    // Set hizb if available in the data
                    if (currentAyahData.hizb) {
                        setCurrentHizb(currentAyahData.hizb);
                    }
                }
            } else {
                // Set default values if no ayah is selected
                setCurrentSurah(1);
                setCurrentAyah(1);
            }
        }, [storage.selected.ayahUUID, takhtitsAyahsBreakers]);

        // Unified function to update all selections based on an ayah
        const updateAllSelections = (ayah: AyahBreakersResponse) => {
            setCurrentSurah(ayah.surah);
            setCurrentAyah(ayah.ayah);
            setCurrentPage(ayah.page || undefined);
            
            // Set juz if available in the data
            if (ayah.juz) {
                setCurrentJuz(ayah.juz);
            }
            
            // Set hizb if available in the data
            if (ayah.hizb) {
                setCurrentHizb(ayah.hizb);
            }
        };

        // Extract juz and hizb data dynamically from takhtitsAyahsBreakers
        const juzData = useMemo(() => {
            const juzMap = new Map();
            takhtitsAyahsBreakers.forEach((ayah) => {
                // Check if ayah has juz property
                if (ayah.juz && !juzMap.has(ayah.juz)) {
                    juzMap.set(ayah.juz, { surah: ayah.surah, ayah: ayah.ayah });
                }
            });
            
            // If no juz data found in the ayah objects, return empty array
            if (juzMap.size === 0) {
                console.log('No juz data found in takhtitsAyahsBreakers. Available properties:', 
                    takhtitsAyahsBreakers.length > 0 ? Object.keys(takhtitsAyahsBreakers[0]) : 'No data');
                return [];
            }
            
            return Array.from(juzMap, ([juz, { surah, ayah }]) => ({ juz, surah, ayah }));
        }, [takhtitsAyahsBreakers]);

        const hizbData = useMemo(() => {
            const hizbMap = new Map();
            takhtitsAyahsBreakers.forEach((ayah) => {
                // Check if ayah has hizb property
                if (ayah.hizb && !hizbMap.has(ayah.hizb)) {
                    hizbMap.set(ayah.hizb, { surah: ayah.surah, ayah: ayah.ayah });
                }
            });
            
            // If no hizb data found in the ayah objects, return empty array
            if (hizbMap.size === 0) {
                console.log('No hizb data found in takhtitsAyahsBreakers. Available properties:', 
                    takhtitsAyahsBreakers.length > 0 ? Object.keys(takhtitsAyahsBreakers[0]) : 'No data');
                return [];
            }
            
            return Array.from(hizbMap, ([hizb, { surah, ayah }]) => ({ hizb, surah, ayah }));
        }, [takhtitsAyahsBreakers]);

        // Binary search function to find ayah by juz/hizb/ruku
        const findAyahByJuz = useMemo(() => {
            return (juz: number) => {
                // Use dynamic juz data extracted from takhtitsAyahsBreakers
                const mapping = juzData.find(m => m.juz === juz);
                if (!mapping) return null;

                // Find the ayah in takhtitsAyahsBreakers
                return takhtitsAyahsBreakers.find(
                    ayah => ayah.surah === mapping.surah && ayah.ayah === mapping.ayah
                );
            };
        }, [takhtitsAyahsBreakers, juzData]);

        const findAyahByHizb = useMemo(() => {
            return (hizb: number) => {
                // Use dynamic hizb data extracted from takhtitsAyahsBreakers
                const mapping = hizbData.find(m => m.hizb === hizb);
                if (!mapping) return null;

                // Find the ayah in takhtitsAyahsBreakers
                return takhtitsAyahsBreakers.find(
                    ayah => ayah.surah === mapping.surah && ayah.ayah === mapping.ayah
                );
            };
        }, [takhtitsAyahsBreakers, hizbData]);

        const findAyahByPage = useMemo(() => {
            return (page: number) => {
                // Find the first ayah on the specified page
                return takhtitsAyahsBreakers.find(ayah => ayah.page === page);
            };
        }, [takhtitsAyahsBreakers]);

        // Get unique juz, hizb, and page numbers for dropdowns
        const availableJuz = useMemo(() => {
            return juzData.map(juz => juz.juz).sort((a, b) => a - b);
        }, [juzData]);

        const availableHizb = useMemo(() => {
            return hizbData.map(hizb => hizb.hizb).sort((a, b) => a - b);
        }, [hizbData]);

        const availablePages = useMemo(() => {
            const pages = new Set(takhtitsAyahsBreakers.map(ayah => ayah.page).filter(Boolean));
            return Array.from(pages).sort((a, b) => (a || 0) - (b || 0));
        }, [takhtitsAyahsBreakers]);

        // Handle juz selection
        const handleJuzSelect = (juz: number) => {
            setCurrentJuz(juz);
            const ayah = findAyahByJuz(juz);
            if (ayah) {
                updateAllSelections(ayah);
            }
        };

        // Handle hizb selection
        const handleHizbSelect = (hizb: number) => {
            setCurrentHizb(hizb);
            const ayah = findAyahByHizb(hizb);
            if (ayah) {
                updateAllSelections(ayah);
            }
        };

        // Handle page selection
        const handlePageSelect = (page: number) => {
            setCurrentPage(page);
            const ayah = findAyahByPage(page);
            if (ayah) {
                updateAllSelections(ayah);
            }
        };

        // Handle surah selection
        const handleSurahSelect = (surah: number) => {
            setCurrentSurah(surah);
            // Reset ayah to 1 when surah changes
            setCurrentAyah(1);
            
            // Find the first ayah of the selected surah to get juz/hizb/page info
            const firstAyahOfSurah = takhtitsAyahsBreakers.find(
                ayah => ayah.surah === surah && ayah.ayah === 1
            );
            if (firstAyahOfSurah) {
                setCurrentPage(firstAyahOfSurah.page || undefined);
                if (firstAyahOfSurah.juz) {
                    setCurrentJuz(firstAyahOfSurah.juz);
                }
                if (firstAyahOfSurah.hizb) {
                    setCurrentHizb(firstAyahOfSurah.hizb);
                }
            }
        };

        // Handle ayah selection
        const handleAyahSelect = (ayah: number) => {
            setCurrentAyah(ayah);
            
            // Find the selected ayah to get juz/hizb/page info
            const selectedAyah = takhtitsAyahsBreakers.find(
                ayahData => ayahData.surah === currentSurah && ayahData.ayah === ayah
            );
            if (selectedAyah) {
                setCurrentPage(selectedAyah.page || undefined);
                if (selectedAyah.juz) {
                    setCurrentJuz(selectedAyah.juz);
                }
                if (selectedAyah.hizb) {
                    setCurrentHizb(selectedAyah.hizb);
                }
            }
        };

        return (
            <Xpopup ref={ref} {...restProps}>
                <Text variant="heading5">By Surah</Text>
                <Row>
                    <Select 
                        placeholder="Surah" 
                        value={currentSurah?.toString() || ""} 
                        onChange={(e) => handleSurahSelect(+e.target.value)}
                    >
                        {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            surahs.map(surah => <option key={surah.number} value={surah.number}>{surah.names[0]?.name}</option>)
                        }
                    </Select>
                    <Select 
                        placeholder="Ayah" 
                        value={currentAyah?.toString() || ""} 
                        onChange={(e) => handleAyahSelect(+e.target.value)}
                    >
                        {
                            [...new Array(surahs.find(surah => surah.number === currentSurah)?.number_of_ayahs || 0)].map((_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)
                        }
                    </Select>
                </Row>
                <Text variant="heading5">By Juz/Hizb/Ruku</Text>
                <Row>
                    <Select 
                        placeholder={juzData.length > 0 ? "Juz" : "Juz (No data)"} 
                        value={currentJuz?.toString() || ""} 
                        onChange={(e) => handleJuzSelect(+e.target.value)}
                        disabled={juzData.length === 0}
                    >
                        {availableJuz.map(juz => (
                            <option key={juz} value={juz}>{juz}</option>
                        ))}
                    </Select>
                    <Select 
                        placeholder={hizbData.length > 0 ? "Hizb" : "Hizb (No data)"} 
                        value={currentHizb?.toString() || ""} 
                        onChange={(e) => handleHizbSelect(+e.target.value)}
                        disabled={hizbData.length === 0}
                    >
                        {availableHizb.map(hizb => (
                            <option key={hizb} value={hizb}>{hizb}</option>
                        ))}
                    </Select>
                    <Select placeholder="Ruku" disabled>
                        <option value={1}>1</option>
                    </Select>
                </Row>
                <Text variant="heading5">By Page</Text>
                <Row>
                    <Select 
                        placeholder="Page" 
                        value={currentPage?.toString() || ""} 
                        onChange={(e) => handlePageSelect(+e.target.value)}
                    >
                        {availablePages.map(page => (
                            <option key={page} value={page?.toString() || ""}>{page}</option>
                        ))}
                    </Select>
                </Row>
                <Row align="center">
                    <Button variant="filled" onClick={() => onButtonClicked(currentSurah || 1, currentAyah || 1)}>
                        Find
                    </Button>
                </Row>
            </Xpopup>
        );
    }
);
