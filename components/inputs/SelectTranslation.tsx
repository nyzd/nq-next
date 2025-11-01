import { getTranslations } from "@/app/actions/getTranslations";
import { PaginatedTranslationListList } from "@ntq/sdk";
import { useSelected } from "@/contexts/selectedsContext";
import { Spinner } from "../ui/spinner";
import { useEffect, useState } from "react";
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

export function SelectTranslation() {
    const [loading, setLoading] = useState(true);
    const [translationsList, setTranslationsList] =
        useState<PaginatedTranslationListList>([]);

    const [selected, setSelected] = useSelected();

    useEffect(() => {
        getTranslations("hafs", 300, 0).then((trs) => {
            setTranslationsList(trs);
            setLoading(false);
        });
    }, []);

    const handleSelectChange = (name: string, value: string) => {
        setSelected((prev) => ({ ...prev, [name]: value }));
    };
    return (
        <Select
            defaultValue={selected.translationUUID}
            onValueChange={(value) => {
                handleSelectChange("translationUUID", value);
            }}
        >
            <SelectTrigger
                id="translation"
                disabled={loading}
                className="w-[180px]"
            >
                {loading && <Spinner />}
                <SelectValue placeholder="Select translation" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>
                    {translationsList.map((translation, index) => (
                        <SelectItem value={translation.uuid} key={index}>
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
