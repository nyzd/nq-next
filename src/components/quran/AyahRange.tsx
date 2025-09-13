"use client";

import { useEffect, useState } from "react";
import { Loading, P, Container } from "@yakad/ui";
import { Ayah } from "@/components";
import { Ayah as AyahType } from "@ntq/sdk";
import { getAyahs } from "@/actions/getAyahs";
import { useStorage } from "@/contexts/storageContext";

interface AyahRangeProps {
    offset: number;
    limit: number;
    mushaf?: string;
    className?: string;
}

export function AyahRange({ offset, limit, mushaf = "hafs", className }: AyahRangeProps) {
    const { storage } = useStorage();
    const [ayahs, setAyahs] = useState<AyahType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAyahs = async () => {
            try {
                setLoading(true);
                setError(null);
                const loadedAyahs = await getAyahs(mushaf, limit, offset);
                setAyahs(loadedAyahs);
            } catch (err) {
                console.error('Error loading ayahs:', err);
                setError('Failed to load ayahs');
            } finally {
                setLoading(false);
            }
        };

        loadAyahs();
    }, [offset, limit, mushaf]);

    if (loading) {
        return (
            <Container size="sm" align="center" className={className}>
                <Loading variant="dots" />
                <P variant="body2" style={{ marginTop: '1rem' }}>
                    Loading ayahs...
                </P>
            </Container>
        );
    }

    if (error) {
        return (
            <Container size="sm" align="center" className={className}>
                <P variant="body1" style={{ color: 'red' }}>
                    {error}
                </P>
            </Container>
        );
    }

    if (ayahs.length === 0) {
        return (
            <Container size="sm" align="center" className={className}>
                <P variant="body1">
                    No ayahs found in the specified range.
                </P>
            </Container>
        );
    }

    return (
        <div className={className}>
            {ayahs.map((ayah, index) => (
                <div key={`${ayah.uuid}-${index}`} style={{ marginBottom: '1rem' }}>
                    {/* Show surah header for first ayah or when surah changes */}
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore */}
                    {ayah.surah && (index === 0 || ayahs[index - 1]?.surah?.uuid !== ayah.surah.uuid) && (
                        <Container size="sm" align="center" style={{ marginBottom: '1.5rem' }}>
                            <P variant="heading6" style={{ marginBottom: '0.5rem' }}>
                                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                {/* @ts-ignore */}
                                {ayah.surah?.names[0]?.name}
                            </P>
                            <P variant="body2" style={{ color: '#666' }}>
                                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                {/* @ts-ignore */}
                                {ayah.surah?.number_of_ayahs} Ayahs
                            </P>
                            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                            {/* @ts-ignore */}
                            {ayah.surah?.bismillah?.text && !ayah.surah?.bismillah?.is_ayah && (
                                <P variant="body1" style={{ 
                                    direction: 'rtl', 
                                    textAlign: 'right',
                                    marginTop: '1rem',
                                    fontStyle: 'italic'
                                }}>
                                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                    {/* @ts-ignore */}
                                    {ayah.surah?.bismillah?.text}
                                </P>
                            )}
                        </Container>
                    )}
                    
                    {/* Render the ayah */}
                    <Ayah
                        number={ayah.number}
                        text={ayah.text}
                        sajdah={ayah.sajdah || "none"}
                        selected={ayah.uuid === storage.selected.ayahUUID}
                    />
                </div>
            ))}
        </div>
    );
}
