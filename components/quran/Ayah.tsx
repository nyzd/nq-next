import { forwardRef } from "react";
import { MushafOptions } from "@/contexts/mushafOptionsContext";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

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

export const Ayah = forwardRef<HTMLDivElement, AyahProps>(
    (
        {
            words,
            id,
            translationText,
            translationRtl,
            onClick,
            selected,
            number,
        },
        ref
    ) => {
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
                <div dir="rtl" className="text-2xl">
                    {words.map((w, i) => (
                        <span key={i}>{w} </span>
                    ))}
                    ({number})
                </div>
                <div
                    dir={translationRtl ? "rtl" : "ltr"}
                    className="opacity-85"
                >
                    {translationText ?? (
                        <Skeleton className="h-[30px] w-[300px] rounded-md" />
                    )}
                </div>
            </div>
        );
    }
);

Ayah.displayName = "Ayah";
