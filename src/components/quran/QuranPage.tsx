"use client"
import { TranslationList, AyahBreakersResponse, Surah } from "@ntq/sdk";
import { AyahRange } from "./AyahRange";
import { Card, Stack } from "@yakad/ui";
import { FindBar } from "./FindBar";
import { useState } from "react";

interface AyahRange {
    offset: number;
    limit: number;
}

interface QuranPageProps {
    index: number;
    mushaf?: string;
    page: {
        pageNumber: number;
        ayahCount: number;
        offset: number;
        limit: number;
    };
    className?: string;
    translation?: TranslationList;
    takhtitsAyahsBreakers: AyahBreakersResponse[];
    surahs: Surah[];
    onLoad?: () => void;
}

export function QuranPage({ mushaf = "hafs", className, translation, takhtitsAyahsBreakers, surahs, page, onLoad}: QuranPageProps) { // If no ayahs found for this page, show a message
    const [selected, setSelected] = useState<string>();
    if (!page) {
        return (
            <div className={className}>
                <div style={{ 
                    padding: '2rem', 
                    textAlign: 'center',
                    color: '#666'
                }}>
                    Page Not found!
                </div>
            </div>
        );
    }

    return (
        <Card align="center" style={{padding: 0}}>
            <FindBar
                takhtitsAyahsBreakers={takhtitsAyahsBreakers}
                surahs={surahs}
                ayahUuid={selected}
                // onAyahSelect={(uuid) => setSelected(prev => ({ ...prev, ayahUUID: uuid }))}
            />
            <Stack style={{ padding: "2rem" }}>
                <AyahRange 
                    offset={page?.offset ?? 0}
                    limit={page?.limit ?? 0}
                    mushaf={mushaf}
                    translation={translation}
                    onLoad={onLoad}
                    firstVisibleAyahChanged={(uuid) => {
                        setSelected(prev => prev !== uuid ? uuid : prev)
                    }}
                />
            </Stack>
        </Card>
    );
}
