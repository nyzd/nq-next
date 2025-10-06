"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AyahBreakersResponse, TranslationList } from "@ntq/sdk";
import { QuranPageSection } from "./QuranPageSection";
import { useSelected } from "@/contexts/selectedsContext";

interface QuranPageWrapperProps {
    takhtitsAyahsBreakers: AyahBreakersResponse[];
    translation?: TranslationList;
}

export function QuranPageWrapper({ takhtitsAyahsBreakers, translation }: QuranPageWrapperProps) {
    const searchParams = useSearchParams();
    const [_selected, setSelected] = useSelected();

    // Handle URL parameter on component mount
    useEffect(() => {
        const ayahUuid = searchParams.get('ayah_uuid');
        
        if (ayahUuid) {
            // Add a small delay to ensure localStorage has been loaded first
            setTimeout(() => {
                setSelected(prev => ({
                    ...prev,
                    ayahUUID: ayahUuid
                }));
            }, 50);
        }
    }, [searchParams, setSelected]);

    return <QuranPageSection takhtitsAyahsBreakers={takhtitsAyahsBreakers} translation={translation} />;
}
