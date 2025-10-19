"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, Spacer, Text, WithOverlay, WithOverlayProps } from "@yakad/ui";
import { AyahBreakersResponse, Surah } from "@ntq/sdk";
import { FindPopup } from "../../popups/FindPopup";
import { Symbol } from "@yakad/symbols";
import { SurahPeriodIcon } from "../../SurahPeriodIcon";

interface FindBarProps extends WithOverlayProps {
    takhtitsAyahsBreakers: AyahBreakersResponse[];
    surahs: Surah[];
    ayahUuid?: string;
    onAyahSelect?: (ayahUuid: string) => void;
}
export function FindBar({
    takhtitsAyahsBreakers,
    surahs,
    ayahUuid,
    onAyahSelect,
    ...restProps
}: FindBarProps) {
    const [top, setTop] = useState(2);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Calculate current ayah info from provided ayah UUID and takhtits data
    const currentAyahInfo = useMemo(() => {
        if (!ayahUuid) {
            return {
                surahnumber: 1,
                ayahnumber: 1,
                pagenumber: 1,
                juz: 1,
                hizb: 1,
                surahName: "Al-Fatihah",
            };
        }

        const currentAyah = takhtitsAyahsBreakers.find(
            (ayah) => ayah.uuid === ayahUuid
        );

        if (!currentAyah) {
            return {
                surahnumber: 1,
                ayahnumber: 1,
                pagenumber: 1,
                juz: 1,
                hizb: 1,
                surahName: "Al-Fatihah",
            };
        }

        const surah = surahs.find((s) => s.number === currentAyah.surah);
        const surahName = surah
            ? surah.names?.[0]?.name || `Surah ${currentAyah.surah}`
            : `Surah ${currentAyah.surah}`;

        return {
            surahnumber: currentAyah.surah,
            ayahnumber: currentAyah.ayah,
            pagenumber: currentAyah.page! - 1 || 1,
            juz: currentAyah.juz! - 1 || 1,
            hizb: currentAyah.hizb || 1,
            surahName: surahName,
        };
    }, [ayahUuid, takhtitsAyahsBreakers, surahs]);

    const handleAyahSelection = (surahNum: number, ayahNum: number) => {
        const targetAyah = takhtitsAyahsBreakers.find(
            (ayah) => ayah.surah === surahNum && ayah.ayah === ayahNum
        );

        if (targetAyah?.uuid) {
            onAyahSelect?.(targetAyah.uuid);
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
        <WithOverlay
            overlay={
                <FindPopup
                    heading="Find"
                    surahs={surahs}
                    takhtitsAyahsBreakers={takhtitsAyahsBreakers}
                    onButtonClicked={handleAyahSelection} // Empty function since logic is now in FindBar
                />
            }
            {...restProps}
            style={{
                position: "sticky",
                top: `${top}rem`,
            }}
        >
            <Card
                level="high"
                blur
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    height: "4rem",
                    padding: "0 2.5rem",
                    fontSize: "1.4rem",
                    transition: "top 0.3s ease",
                    willChange: "top",
                    zIndex: "1",
                    cursor: "pointer",
                    userSelect: "none",
                }}
            >
                <SurahPeriodIcon period={"madani"} />
                <Text color="onSurfaceVariantColor">
                    {"SurahName" + ": " + currentAyahInfo.ayahnumber}
                </Text>
                <Spacer />
                <Text color="onSurfaceVariantColor">
                    {"Juz" +
                        currentAyahInfo.juz +
                        " - " +
                        "Page" +
                        currentAyahInfo.pagenumber}
                </Text>
                <Symbol
                    icon={"menu_book"}
                    size="small"
                    mirror={
                        currentAyahInfo.pagenumber % 2 === 0
                            ? "vertical"
                            : undefined
                    }
                />
            </Card>
        </WithOverlay>
    );
}
