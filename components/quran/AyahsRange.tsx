"use client";
import { useRef } from "react";
import { getAyahs } from "@/app/actions/getAyahs";
import { Ayah as AyahType } from "@ntq/sdk";
import { useEffect, useState } from "react";
import { Ayah } from "./Ayah";
import { MushafOptions } from "@/contexts/mushafOptionsContext";
import { PaginatedAyahTranslationList } from "@ntq/sdk";
import { getTranslationAyahs } from "@/app/actions/getTranslations";
import { useSelected } from "@/contexts/selectedsContext";
import { ActiveOnVisible } from "../activeOnVisible/ActiveOnVisible";
import SurahHeader from "./SurahHeader";
import { Skeleton } from "../ui/skeleton";

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

export function AyahsRange({
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
                    setTranslations([]);
                }
            } catch (err) {
                console.error("Error loading ayahs/translations:", err);
                setError(`Failed to load ayahs or translations ${err}`);
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
            <div className="flex flex-col gap-4">
                <Skeleton className="h-[60px] w-[622px] rounded-md" />
                <Skeleton className="h-[60px] w-[622px] rounded-md" />
                <Skeleton className="h-[60px] w-[622px] rounded-md" />
                <Skeleton className="h-[60px] w-[622px] rounded-md" />
                <Skeleton className="h-[60px] w-[622px] rounded-md" />
            </div>
        );
    }

    if (error) {
        return (
            <div className={className}>
                <p style={{ color: "red" }}>{error}</p>
            </div>
        );
    }

    if (ayahs.length === 0) {
        return (
            <div className={className}>
                <p>No ayahs found in the specified range.</p>
            </div>
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
        <div className="flex flex-col gap-4">
            {ayahs.map((ayah, index) => (
                <div key={index}>
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
                                                number={1}
                                                words={ayah.text.split(" ")}
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
                                                translationText={
                                                    translations?.[index]?.text
                                                }
                                            />
                                        </ActiveOnVisible>
                                    ) : (
                                        <div style={{ paddingTop: "2rem" }}>
                                            <p>{surah?.bismillah?.text}</p>
                                            <p>{translations?.[index]?.text}</p>
                                        </div>
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
                                words={ayah.text.split(" ")}
                                translationText={translations?.[index]?.text}
                                mushafOptions={mushafOptions}
                                sajdah={ayah.sajdah || "none"}
                                selected={ayah.uuid === selected.ayahUUID}
                                onClick={() => handleAyahClick(ayah.uuid)}
                            />
                        </ActiveOnVisible>
                    )}
                </div>
            ))}
        </div>
    );
}
