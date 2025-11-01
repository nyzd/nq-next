import { Ref } from "react";
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
    onClick?: () => void;
    ref?: Ref<HTMLDivElement>;
}

export function Ayah({
    words,
    id,
    translationText,
    onClick,
    selected,
}: AyahProps) {
    return (
        <div
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
            <div>{translationText}</div>
        </div>
    );
}
