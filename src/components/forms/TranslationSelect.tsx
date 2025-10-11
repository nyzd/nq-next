"use client";

import { getTranslations } from "@/actions/getTranslations";
import { useSelected } from "@/contexts/selectedsContext";
import { PaginatedTranslationListList } from "@ntq/sdk";
import { Select, SelectProps } from "@yakad/ui";
import { forwardRef, useEffect, useState } from "react";

export const TranslationSelect = forwardRef<HTMLSelectElement, SelectProps>(
    function TranslationSelect ({ ...restProps }, ref) {
        const [translations, setTranslations] = useState<PaginatedTranslationListList>([]);
        const [_, setSelected] = useSelected();

        useEffect(() => {
            getTranslations("hafs", 200).then((res) => setTranslations(res));
        }, [])

        return (
            <Select ref={ref} {...restProps} onChange={(e) => setSelected((older) => ({...older, translationUUID: e.target.value}))}>
                {translations.map((translation, index) => <option key={index} value={translation.uuid}>{translation.language}</option>)}
            </Select>
        );
    }
);
