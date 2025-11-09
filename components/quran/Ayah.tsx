import { forwardRef } from "react";
import { MushafOptions } from "@/contexts/mushafOptionsContext";
import { cn } from "@/lib/utils";

export interface AyahProps {
    words: string[];
    id: string;
    number: number;
    sajdah?: string;
    selected?: boolean;
    translationText?: string;
    mushafOptions?: MushafOptions;
    translationRtl?: boolean;
    onClick?: () => void;
}

export const Ayah = forwardRef<HTMLDivElement, AyahProps>(({
    words,
    id,
    translationText,
    translationRtl,
    onClick,
    selected,
}, ref) => {
    return (
        <div
            ref={ref}
            id={id}
            onClick={onClick}
            className={cn(
                "flex flex-col gap-3 p-5 hover:bg-neutral-800 rounded-md transition-all",
                selected && "bg-neutral-800"
            )}
        >
            <div dir="rtl">
                {words.map((w, i) => (
                    <span key={i}>{w} </span>
                ))}
            </div>
            <div dir={translationRtl ? "rtl" : "ltr"}>{translationText}</div>
        </div>
    );
});

Ayah.displayName = "Ayah";
