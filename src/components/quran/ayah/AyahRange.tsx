"use client";

import { useEffect, useState, useRef } from "react";
import { LoadingIcon, P, Container, Stack, ActiveOnVisible } from "@yakad/ui";
import { Ayah } from "@/components";
import SurahHeader from "./SurahHeader";
import { Ayah as AyahType, PaginatedAyahTranslationList } from "@ntq/sdk";
import { getAyahs } from "@/actions/getAyahs";
import { getTranslationAyahs } from "@/actions/getTranslations";
import { useSelected } from "@/contexts/selectedsContext";
import { MushafOptions } from "@/contexts/mushafOptionsContext";

interface AyahRangeProps {
    offset: number;
    limit: number;
    mushaf?: string;
    className?: string;
    translationUuid?: string;
    onLoad?: () => void;
    mushafOptions?: MushafOptions;
    firstVisibleAyahChanged: (uuid: string) => void;
}

export function AyahRange({
    offset,
    limit,
    mushaf = "hafs",
    className,
    translationUuid,
    mushafOptions,
    onLoad,
    firstVisibleAyahChanged,
}: AyahRangeProps) {
    const [selected, setSelected] = useSelected();
    const [ayahs, setAyahs] = useState<AyahType[]>([]);
    const [translations, setTranslations] =
        useState<PaginatedAyahTranslationList>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleAyahs, setVisibleAyahs] = useState<Set<number>>(new Set());

    useEffect(() => {
        const first = Math.min(...visibleAyahs.keys());
        if (ayahs[first]) {
            firstVisibleAyahChanged(ayahs[first].uuid);
        }
    }, [visibleAyahs, ayahs, firstVisibleAyahChanged]);

    const ayahsRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Handle ayah click to update selected ayah
    const handleAyahClick = (ayahUUID: string) => {
        setSelected((prev) => ({
            ...prev,
            ayahUUID: ayahUUID,
        }));
    };

    useEffect(() => {
        const selected_ayah = selected.ayahUUID ?? undefined;
        if (selected_ayah && ayahsRefs.current[selected_ayah]) {
            ayahsRefs.current[selected_ayah].scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [selected.ayahUUID]);

    // After ayahs render/update, try scrolling to the selected ayah again
    useEffect(() => {
        const selected_ayah = selected.ayahUUID ?? undefined;
        if (!selected_ayah) return;
        // Defer to next tick to ensure refs are attached
        const id = window.setTimeout(() => {
            const el = ayahsRefs.current[selected_ayah];
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 0);
        return () => window.clearTimeout(id);
    }, [ayahs, selected.ayahUUID]);

    useEffect(() => {
        let isActive = true;

        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const ayahsPromise = getAyahs(mushaf, limit, offset);
                const translationsPromise = translationUuid
                    ? getTranslationAyahs(translationUuid, limit, offset)
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
                }
            }
        };

        loadData();

        return () => {
            isActive = false;
        };
    }, [offset, limit, mushaf, translationUuid]);

    if (loading) {
        return (
            <Container size="sm" align="center" className={className}>
                <LoadingIcon variant="dots" />
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

    const onVisibilityChange = (visible: boolean, index: number) => {
        if (visible) {
            setVisibleAyahs((set) => {
                if (set.has(index)) return set;
                return new Set(set).add(index);
            });
        } else {
            setVisibleAyahs((set) => {
                if (!set.has(index)) return set;
                const newSet = new Set(set);
                newSet.delete(index);
                return newSet;
            });
        }
    };

    return (
        <>
            {ayahs.map((ayah, index) => (
                <Stack key={index}>
                    {ayah.surah &&
                        (index === 0 ||
                            ayahs[index - 1]?.surah?.uuid !==
                                ayah.surah.uuid) && (
                            <SurahHeader
                                surah={ayah.surah}
                                bismillah={(surah) =>
                                    surah?.bismillah?.is_ayah ? (
                                        <ActiveOnVisible
                                            onVisibilityChange={(visible) =>
                                                onVisibilityChange(
                                                    visible,
                                                    index
                                                )
                                            }
                                        >
                                            <Ayah
                                                align="center"
                                                number={1}
                                                text={ayah.text}
                                                id={`ayah-${ayah.uuid}`}
                                                ref={(el) => {
                                                    ayahsRefs.current[
                                                        ayah.uuid
                                                    ] = el;
                                                }}
                                                mushafOptions={mushafOptions}
                                                selected={
                                                    ayah.uuid ===
                                                    selected.ayahUUID
                                                }
                                                onClick={() =>
                                                    handleAyahClick(ayah.uuid)
                                                }
                                                translationText={
                                                    translations?.[index]?.text
                                                }
                                            />
                                        </ActiveOnVisible>
                                    ) : (
                                        <Stack
                                            align="center"
                                            style={{ paddingTop: "2rem" }}
                                        >
                                            <P variant="body2">
                                                {surah?.bismillah?.text}
                                            </P>
                                            <P variant="body4">
                                                {translations?.[index]?.text}
                                            </P>
                                        </Stack>
                                    )
                                }
                            />
                        )}

                    {!ayah.surah?.bismillah.is_ayah && (
                        <ActiveOnVisible
                            onVisibilityChange={(visible) =>
                                onVisibilityChange(visible, index)
                            }
                        >
                            <Ayah
                                ref={(el) => {
                                    ayahsRefs.current[ayah.uuid] = el;
                                }}
                                id={`ayah-${ayah.uuid}`}
                                number={ayah.number}
                                text={ayah.text}
                                translationText={translations?.[index]?.text}
                                mushafOptions={mushafOptions}
                                sajdah={ayah.sajdah || "none"}
                                selected={ayah.uuid === selected.ayahUUID}
                                onClick={() => handleAyahClick(ayah.uuid)}
                            />
                        </ActiveOnVisible>
                    )}
                </Stack>
            ))}
        </>
    );
}
