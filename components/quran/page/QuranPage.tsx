"use client";

import { AyahBreakersResponse, Surah } from "@ntq/sdk";
import { AyahsRange } from "../AyahsRange";
// import { FindBar } from "./FindBar";
import { useSelected } from "@/contexts/selectedsContext";
import { useMushafOptions } from "@/contexts/mushafOptionsContext";
import { Card, CardContent } from "@/components/ui/card";
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
    takhtitsAyahsBreakers: AyahBreakersResponse[];
    surahs: Surah[];
    onLoad?: () => void;
}

export function QuranPage({
    mushaf = "hafs",
    className,
    takhtitsAyahsBreakers,
    surahs,
    page,
    onLoad,
}: QuranPageProps) {
    // If no ayahs found for this page, show a message
    const [mushafOptions] = useMushafOptions();
    const [selected] = useSelected();
    const [visible, setVisible] = useState<string>(
        takhtitsAyahsBreakers[page.offset].uuid || ""
    );

    if (!page) {
        return (
            <div className={className}>
                <div
                    style={{
                        padding: "2rem",
                        textAlign: "center",
                        color: "#666",
                    }}
                >
                    Page Not found!
                </div>
            </div>
        );
    }

    return (
        <Card>
            {/* <FindBar
                takhtitsAyahsBreakers={takhtitsAyahsBreakers}
                surahs={surahs}
                ayahUuid={visible}
                onAyahSelect={(uuid) =>
                    setSelected((prev) => ({ ...prev, ayahUUID: uuid }))
                }
            /> */}
            <CardContent>
                <AyahsRange
                    offset={page?.offset ?? 0}
                    limit={page?.limit ?? 0}
                    mushaf={mushaf}
                    translationUuid={selected.translationUUID}
                    onLoad={onLoad}
                    mushafOptions={mushafOptions}
                    firstVisibleAyahChanged={(uuid) => {
                        setVisible((prev) => (prev !== uuid ? uuid : prev));
                    }}
                />
            </CardContent>
        </Card>
    );
}
