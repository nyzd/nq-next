"use client";

import { getTranslations } from "@/actions/getTranslations";
import { useSelected } from "@/contexts/selectedsContext";
import { PaginatedTranslationListList } from "@ntq/sdk";
import { LoadingIcon, Select, SelectProps } from "@yakad/ui";
import { useEffect, useState } from "react";

export function TranslationSelect({ ...restProps }: SelectProps) {
    const [translations, setTranslations] =
        useState<PaginatedTranslationListList>([]);
    const [_, setSelected] = useSelected();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTranslations("hafs", 200).then((res) => {
            setTranslations(res);
            setLoading(false);
        });
    }, []);

    return (
        <>
            {translations.length <= 0 && !loading ? (
                "Translations Not Found!"
            ) : !loading ? (
                <Select
                    {...restProps}
                    disabled={loading}
                    onChange={(e) =>
                        setSelected((older) => ({
                            ...older,
                            translationUUID: e.target.value,
                        }))
                    }
                >
                    {translations.map((translation, index) => (
                        <option key={index} value={translation.uuid}>
                            {translation.language}
                        </option>
                    ))}
                </Select>
            ) : (
                <LoadingIcon />
            )}
        </>
    );
}
