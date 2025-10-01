"use client";

import { useEffect, useState, useRef } from "react";
import { LoadingIcon, P, Container, Stack } from "@yakad/ui";
import { Ayah } from "@/components";
import SurahHeader from "./SurahHeader";
import {
    Ayah as AyahType,
    PaginatedAyahTranslationList,
    TranslationList,
} from "@ntq/sdk";
import { getAyahs } from "@/actions/getAyahs";
import { useStorage } from "@/contexts/storageContext";
import { getTranslationAyahs } from "@/actions/getTranslations";

interface AyahRangeProps {
    offset: number;
    limit: number;
    mushaf?: string;
    className?: string;
    translation?: TranslationList;
    onLoad?: () => void;
}

export function AyahRange({
    offset,
    limit,
    mushaf = "hafs",
    className,
    translation,
    onLoad,
}: AyahRangeProps) {
    const { storage, setStorage } = useStorage();
    const [ayahs, setAyahs] = useState<AyahType[]>([]);
    const [translations, setTranslations] =
        useState<PaginatedAyahTranslationList>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const ayahsRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Handle ayah click to update selected ayah
    const handleAyahClick = (ayahUUID: string) => {
        setStorage((prev) => ({
            ...prev,
            selected: {
                ...prev.selected,
                ayahUUID: ayahUUID,
            },
        }));
    };

    useEffect(() => {
        const selected_ayah = storage.selected.ayahUUID ?? undefined;
        if (selected_ayah && ayahsRefs.current[selected_ayah]) {
            ayahsRefs.current[selected_ayah].scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [storage.selected.ayahUUID]);

    // After ayahs render/update, try scrolling to the selected ayah again
    useEffect(() => {
        const selected_ayah = storage.selected.ayahUUID ?? undefined;
        if (!selected_ayah) return;
        // Defer to next tick to ensure refs are attached
        const id = window.setTimeout(() => {
            const el = ayahsRefs.current[selected_ayah];
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 0);
        return () => window.clearTimeout(id);
    }, [ayahs, storage.selected.ayahUUID]);

    useEffect(() => {
        let isActive = true;

        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const ayahsPromise = getAyahs(mushaf, limit, offset);
                const translationsPromise = translation?.uuid
                    ? getTranslationAyahs(translation.uuid, limit, offset)
                    : Promise.resolve(undefined);

                const [loadedAyahs, loadedTranslations] = await Promise.all([
                    ayahsPromise,
                    translationsPromise,
                ]);

                if (!isActive) return;

                setAyahs(loadedAyahs);
                // Only set translations if a translation is selected
                if (loadedTranslations) {
                    setTranslations(loadedTranslations);
                } else {
                    setTranslations(undefined);
                }
            } catch (err) {
                console.error("Error loading ayahs/translations:", err);
                setError("Failed to load ayahs or translations");
            } finally {
                if (isActive) {
                    setLoading(false);
                    onLoad?.();
                };
            }
        };

        loadData();

        return () => {
            isActive = false;
        };
    }, [offset, limit, mushaf, translation?.uuid]);

    if (loading) {
        return (
            <Container size="sm" align="center" className={className}>
                <LoadingIcon variant="dots" />
                <P variant="body2" style={{ marginTop: "1rem" }}>
                    Loading ayahs...
                </P>
            </Container>
        );
    }

    if (error) {
        return (
            <Container size="sm" align="center" className={className}>
                <P variant="body1" style={{ color: "red" }}>
                    {error}
                </P>
            </Container>
        );
    }

    if (ayahs.length === 0) {
        return (
            <Container size="sm" align="center" className={className}>
                <P variant="body1">No ayahs found in the specified range.</P>
            </Container>
        );
    }

    return (
        <>
            {ayahs.map((ayah, index) => (
                <Stack key={index}>
                    {ayah.surah &&
                        (index === 0 ||
                            ayahs[index - 1]?.surah?.uuid !==
                                ayah.surah.uuid) && (
                            <SurahHeader surah={ayah.surah} bismillah={(surah) => 
                                (
                                    surah?.bismillah?.is_ayah
                                        ? <Ayah
                                                number={1}
                                                text={ayah.text}
                                                id={`ayah-${ayah.uuid}`}
                                                ref={(el) => {
                                                    ayahsRefs.current[ayah.uuid] = el;
                                                }}
                                                selected={ayah.uuid === storage.selected.ayahUUID}
                                                onClick={() => handleAyahClick(ayah.uuid)}
                                            />
                                        : surah?.bismillah?.text
                                )
                            } />
                        )}

                    {!ayah.surah?.bismillah.is_ayah && 
                        <Ayah
                            ref={(el) => {
                                ayahsRefs.current[ayah.uuid] = el;
                            }}
                            id={`ayah-${ayah.uuid}`}
                            number={ayah.number}
                            text={ayah.text}
                            translationText={translations?.[index]?.text}
                            sajdah={ayah.sajdah || "none"}
                            selected={ayah.uuid === storage.selected.ayahUUID}
                            onClick={() => handleAyahClick(ayah.uuid)}
                        />
                    }
                </Stack>
            ))}
        </>
    );
}
