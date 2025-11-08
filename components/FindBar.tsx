"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Item, ItemContent, ItemTitle } from "./ui/item";
import { AyahBreakersResponse, Surah } from "@ntq/sdk";
import { ListIndentIncrease } from "lucide-react";
import { FindPopup } from "./popups/FindPopup";

interface FindBarProps {
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
}: FindBarProps) {
    const [top, setTop] = useState(2);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

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
        <>
            <Item
                size="sm"
                onClick={() => setIsOpen(true)}
                variant="default"
                className="max-w-2xl sticky top-20 bg-neutral-800/50 backdrop-blur supports-backdrop-filter:bg-neutral-800/50 cursor-pointer"
            >
                <ItemContent>
                    <ItemTitle className="w-full flex flex-row items-center justify-between gap-0.5">
                        <h3>
                            {"SurahName" + ": " + currentAyahInfo.ayahnumber}
                        </h3>
                        <h3 color="onSurfaceVariantColor">
                            {"Juz" +
                                currentAyahInfo.juz +
                                " - " +
                                "Page" +
                                currentAyahInfo.pagenumber}
                        </h3>
                        <ListIndentIncrease
                            strokeWidth={2}
                            style={
                                currentAyahInfo.pagenumber % 2 === 0
                                    ? undefined
                                    : { transform: "scaleX(-1)" }
                            }
                        />
                    </ItemTitle>
                </ItemContent>
            </Item>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Jumpt to Ayah</DialogTitle>
                        <DialogDescription>
                            Find your specific ayah using parameters below
                        </DialogDescription>
                    </DialogHeader>
                    <FindPopup
                        surahs={surahs}
                        takhtitsAyahsBreakers={takhtitsAyahsBreakers}
                        onButtonClicked={handleAyahSelection}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
