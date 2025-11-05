"use client";

import { PaginatedTranslationListList } from "@ntq/sdk";
import { useSelected } from "@/contexts/selectedsContext";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";

export function SelectTranslation({
    translations,
}: {
    translations: PaginatedTranslationListList;
}) {
    const [selected, setSelected] = useSelected();

    const handleSelectChange = (name: string, value: string) => {
        const [translation_uuid, language_is_rtl] = value.split(":");

        setSelected((prev) => ({
            ...prev,
            translationUUID: translation_uuid,
            translationRtl: language_is_rtl === "true" ? true : false,
        }));
    };

    return (
        <Select
            defaultValue={`${selected.translationUUID}:${selected.translationRtl}`}
            onValueChange={(value) => {
                handleSelectChange("translationUUID", value);
            }}
        >
            <SelectTrigger id="translation" className="w-[180px]">
                <SelectValue placeholder="Select translation" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>
                    {translations.map((translation, index) => (
                        <SelectItem
                            value={`${translation.uuid}:${translation.language_is_rtl}`}
                            key={index}
                        >
                            {translation.language}
                            <Separator orientation="vertical" />
                            {translation.source}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
