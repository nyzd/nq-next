"use client";

import { AyahBreakersResponse, Surah } from "@ntq/sdk";
import { AyahsRange } from "../AyahsRange";
// import { FindBar } from "./FindBar";
import { useEffect, useState } from "react";
import { useSelected } from "@/contexts/selectedsContext";
import { getTranslations } from "@/app/actions/getTranslations";
import { useMushafOptions } from "@/contexts/mushafOptionsContext";
import { Card, CardContent } from "@/components/ui/card";

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
    const [selected, setSelected] = useSelected();
    const [visible, setVisible] = useState<string>(
        takhtitsAyahsBreakers[page.offset].uuid || ""
    );

    useEffect(() => {
        if (!selected.translationUUID || selected.translationUUID === "UUID") {
            getTranslations("hafs", 100, 0, "en").then((res) => {
                setSelected((prev) => ({
                    ...prev,
                    translationUUID: res[0].uuid,
                }));
            });
        }
    }, [selected.translationUUID, setSelected]);

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
