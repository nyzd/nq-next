"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useStorage } from "@/contexts/storageContext";
import { QuranPageClient } from "./QuranPageClient";
import { AyahBreakersResponse } from "@ntq/sdk";

interface QuranPageWrapperProps {
    takhtitsAyahsBreakers: AyahBreakersResponse[];
}

export function QuranPageWrapper({ takhtitsAyahsBreakers }: QuranPageWrapperProps) {
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

    return <QuranPageClient takhtitsAyahsBreakers={takhtitsAyahsBreakers} />;
}
