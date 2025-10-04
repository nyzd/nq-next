"use client";

import { forwardRef, useEffect, useState, useMemo } from "react";
import { Card, Text, WithOverlay, WithOverlayProps } from "@yakad/ui";
import { AyahBreakersResponse, Surah } from "@ntq/sdk";
import { FindPopup } from "../popups/FindPopup";
import { useStorage } from "@/contexts/storageContext";

interface FindBarProps extends WithOverlayProps {
    takhtitsAyahsBreakers: AyahBreakersResponse[];
    surahs: Surah[];
}
export const FindBar = forwardRef<HTMLDivElement, FindBarProps>(
    function FindBar(
        {
            takhtitsAyahsBreakers,
            surahs,
            ...restProps
        },
        ref
    ) {
        const [top, setTop] = useState(2);
        const [lastScrollY, setLastScrollY] = useState(0);
        const {storage, setStorage} = useStorage();

        // Calculate current ayah info from selected ayah UUID and takhtits data
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
            
            return {
                surahnumber: currentAyah.surah,
                ayahnumber: currentAyah.ayah,
                pagenumber: currentAyah.page || 1,
                juz: currentAyah.juz || 1,
                hizb: currentAyah.hizb || 1,
                surahName: surahName
            };
        }, [storage.selected.ayahUUID, takhtitsAyahsBreakers, surahs]);

        const handleAyahSelection = (surahNum: number, ayahNum: number) => {
            // Fallback to internal logic
            const targetAyah = takhtitsAyahsBreakers.find(
                ayah => ayah.surah === surahNum && ayah.ayah === ayahNum
            );

            if (targetAyah && targetAyah.uuid) {
                // Update localStorage with the selected ayah UUID
                setStorage((prev: any) => ({
                    ...prev,
                    selected: {
                        ...prev.selected,
                        ayahUUID: targetAyah.uuid
                    }
                }));
            }
        };

        useEffect(() => {
            const handleScroll = () => {
                const currentScrollY = window.scrollY;

                if (currentScrollY > lastScrollY && currentScrollY > 50) {
                    // Scroll down
                    setTop(2);
                } else {
                    // Scroll up
                    setTop(8);
                }

                setLastScrollY(currentScrollY);
            };

            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }, [lastScrollY]);

        return (
            <WithOverlay overlay={
                <FindPopup
                    heading="Find"
                    surahs={surahs}
                    takhtitsAyahsBreakers={takhtitsAyahsBreakers}
                    onButtonClicked={handleAyahSelection} // Empty function since logic is now in FindBar
                />
            }
                ref={ref}
                {...restProps}
                style={{
                    position: "sticky",
                    top: `${top}rem`,
                }}
            >
                <Card
                    blur
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "4rem",
                        padding: "0 2.5rem",
                        fontSize: "1.4rem",
                        boxShadow:
                            "1.8rem -2rem 0 0.6rem rgb(var(--surfaceColor, 254 247 255)), -1.8rem -2rem 0 0.6rem rgb(var(--surfaceColor, 254 247 255))",
                        transition: "top 0.3s ease",
                        willChange: "top",
                        zIndex: "1",
                        cursor: "pointer",
                        userSelect: "none",
                    }}
                >
                    <Text>
                        {currentAyahInfo.surahnumber +
                            ". " +
                            (currentAyahInfo.surahName || "Al-Fatihah") +
                            ": " +
                            currentAyahInfo.ayahnumber}
                    </Text>
                    <Text>{"Page " + currentAyahInfo.pagenumber}</Text>
                    <Text>{"Juz " + currentAyahInfo.juz + " / " + "Hizb " + currentAyahInfo.hizb}</Text>
                </Card>
            </WithOverlay>
        );
    }
);
