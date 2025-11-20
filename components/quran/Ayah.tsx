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
            mushafOptions,
        },
        ref
    ) => {
        const arabicFontSizeClass = {
            small: "text-xl",
            medium: "text-2xl",
            large: "text-4xl",
        }[mushafOptions?.arabicFontSize ?? "medium"];

        const translationFontSizeClass = {
            small: "text-sm",
            medium: "text-base",
            large: "text-lg",
        }[mushafOptions?.translationFontSize ?? "medium"];

        const textAlignClass =
            mushafOptions?.textAlign === "center"
                ? "text-center"
                : "text-right";

        const translationAlignClass =
            mushafOptions?.textAlign === "center"
                ? "text-center"
                : translationRtl
                ? "text-right"
                : "text-left";

        return (
            <div
                ref={ref}
                id={id}
                onClick={onClick}
                className={cn(
                    "flex flex-col gap-3 p-5 hover:bg-neutral-800/50 rounded-md transition-all",
                    selected && "bg-neutral-800/50"
                )}
            >
                <div
                    dir="rtl"
                    className={cn(arabicFontSizeClass, textAlignClass)}
                >
                    {words.map((w, i) => (
                        <span key={i}>{w} </span>
                    ))}
                    ({number})
                </div>
                <div
                    dir={translationRtl ? "rtl" : "ltr"}
                    className={cn(
                        "opacity-85",
                        translationFontSizeClass,
                        translationAlignClass
                    )}
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
