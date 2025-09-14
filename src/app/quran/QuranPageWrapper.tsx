"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useStorage } from "@/contexts/storageContext";
import { AyahBreakersResponse, TranslationList } from "@ntq/sdk";
import { QuranPageSection } from "./QuranPageSection";

interface QuranPageWrapperProps {
    takhtitsAyahsBreakers: AyahBreakersResponse[];
    translation?: TranslationList;
}

export function QuranPageWrapper({ takhtitsAyahsBreakers, translation }: QuranPageWrapperProps) {
    const searchParams = useSearchParams();
    const { setStorage } = useStorage();

    // Handle URL parameter on component mount
    useEffect(() => {
        const ayahUuid = searchParams.get('ayah_uuid');
        
        if (ayahUuid) {
            // Add a small delay to ensure localStorage has been loaded first
            setTimeout(() => {
                setStorage(prev => ({
                    ...prev,
                    selected: {
                        ...prev.selected,
                        ayahUUID: ayahUuid
                    }
                }));
            }, 50);
        }
    }, [searchParams, setStorage]);

    return <QuranPageSection takhtitsAyahsBreakers={takhtitsAyahsBreakers} translation={translation} />;
}
