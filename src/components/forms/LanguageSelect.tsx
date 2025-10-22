"use client";

import { LangCodeType, langName } from "@yakad/lib";
import { Select, SelectProps } from "@yakad/ui";
import { usePreferences } from "@/contexts/preferencesContext";

const acceptedLangCodes: LangCodeType[] = ["en", "ar", "fa", "tr"];

export function LanguageSelect({
    placeholder,
    onChange,
    ...restProps
}: Omit<SelectProps, "name" | "value">) {
    const [preferences, setPreferences] = usePreferences();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPreferences((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Select
            name="language"
            placeholder={placeholder || "Language"}
            value={preferences.language}
            onChange={(e) => {
                handleChange(e);
                onChange?.(e);
            }}
            {...restProps}
        >
            {acceptedLangCodes.map((value) => (
                <option key={value} value={value}>
                    {langName(value)}
                </option>
            ))}
        </Select>
    );
}
