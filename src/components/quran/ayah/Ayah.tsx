"use client";

import { useRef, useState } from "react";
import classNames from "classnames";
import { Card, CardProps, P } from "@yakad/ui";
import styles from "./Ayah.module.css";
import { MushafOptions } from "@/contexts/mushafOptionsContext";

interface AyahProps extends CardProps {
    number: number;
    text: string;
    sajdah?: string;
    selected?: boolean;
    translationText?: string;
    mushafOptions?: MushafOptions;
    onHold?: () => void;
    onRightClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export function Ayah({
    number,
    sajdah,
    text,
    translationText,
    selected = false,
    mushafOptions,
    onHold,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
    onRightClick,
    onContextMenu,
    className,
    ...restProps
}: AyahProps) {
    const [isHolding, setIsHolding] = useState<boolean>(false);
    const holdTimeout = useRef<number>(0);
    const handleHoldStart = () => {
        setIsHolding(true);
        if (onHold) {
            holdTimeout.current = window.setTimeout(() => {
                setIsHolding(false);
                onHold();
            }, 700);
        }
    };
    const handleHoldEnd = () => {
        setIsHolding(false);
        clearTimeout(holdTimeout.current);
    };

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        onRightClick?.(event);
        clearTimeout(holdTimeout.current);
        setIsHolding(false);
    };

    const joinedClassNames = classNames(
        styles.ayah,
        { [styles.holding]: isHolding },
        className
    );

    return (
        <Card
            onMouseDown={(e) => {
                handleHoldStart();
                onMouseDown?.(e);
            }}
            onMouseUp={(e) => {
                handleHoldEnd();
                onMouseUp?.(e);
            }}
            onMouseLeave={(e) => {
                handleHoldEnd();
                onMouseLeave?.(e);
            }}
            onTouchStart={(e) => {
                handleHoldStart();
                onTouchStart?.(e);
            }}
            onTouchEnd={(e) => {
                handleHoldEnd();
                onTouchEnd?.(e);
            }}
            onContextMenu={(e) => {
                handleContextMenu(e);
                onContextMenu?.(e);
            }}
            className={joinedClassNames}
            level={selected ? undefined : "transparent"}
            hoverEffect
            {...restProps}
        >
            <div style={{ direction: "rtl", textAlign: "right" }}>
                <P
                    variant={
                        mushafOptions?.arabicFontSize === "medium"
                            ? "body2"
                            : mushafOptions?.arabicFontSize === "large"
                            ? "body1"
                            : "body5"
                    }
                    style={{
                        textAlign: "justify",
                        textAlignLast:
                            mushafOptions?.textAlign === "normal"
                                ? "start"
                                : "center",
                    }}
                >
                    {/* TODO:‌ This doens't seem ok */}
                    {text.split(" ").map((word, index) => (
                        <span key={index}>{`${word} `}</span>
                    ))}
                    <SajdahIcon sajdah={sajdah} />
                    <AyahNumber number={number} />
                </P>
            </div>
            {translationText && (
                <P
                    variant={
                        mushafOptions?.translationFontSize === "medium"
                            ? "body3"
                            : mushafOptions?.translationFontSize === "large"
                            ? "body1"
                            : "body5"
                    }
                    palette="onSurfaceVariantColor"
                    style={{
                        marginTop: "20px",
                        textAlign: "justify",
                        textAlignLast:
                            mushafOptions?.textAlign === "normal"
                                ? "start"
                                : "center",
                    }}
                >
                    {translationText}
                </P>
            )}
        </Card>
    );
}

const SajdahIcon = ({ sajdah }: { sajdah?: string }) => {
    if (sajdah === "vajib")
        return (
            <span
                title="Vajib Sajdah"
                style={{ cursor: "help", fontWeight: "bold" }}
            >
                {`۩ `}
            </span>
        );
    if (sajdah === "mustahab")
        return (
            <span title="Mustahab Sajdah" style={{ cursor: "help" }}>
                {`۩ `}
            </span>
        );
};

const AyahNumber = ({ number }: { number: number }) => {
    const toArabic = (num: number) => num.toLocaleString("ar-EG");

    return <span>{`﴿${toArabic(number)}﴾ `}</span>;
};
