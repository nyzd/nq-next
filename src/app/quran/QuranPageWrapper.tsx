"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AyahBreakersResponse } from "@ntq/sdk";
import { QuranPageSection } from "./QuranPageSection";
import { useSelected } from "@/contexts/selectedsContext";

interface QuranPageWrapperProps {
    takhtitsAyahsBreakers: AyahBreakersResponse[];
}

export function QuranPageWrapper({ takhtitsAyahsBreakers }: QuranPageWrapperProps) {
    const searchParams = useSearchParams();
    const [_, setSelected] = useSelected();

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

    return <QuranPageSection takhtitsAyahsBreakers={takhtitsAyahsBreakers} />;
}
