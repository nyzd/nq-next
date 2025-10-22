import { SvgIcon, SvgIconProps } from "@yakad/ui";
import MadinehFilledIcon from "@/assets/svg/madinehFilledIcon";
import MadinehOutlinedIcon from "@/assets/svg/madinehOutlinedIcon";
import MakkahOutlinedIcon from "@/assets/svg/makkahOutlinedIcon";
import MakkahFilledIcon from "@/assets/svg/makkahFilledIcon";
import React from "react";

interface SurahPeriodIconProps extends Omit<SvgIconProps, "children"> {
    variant?: "outlined" | "filled";
    period: "makki" | "madani";
    ref?: React.Ref<HTMLDivElement>;
}

export function SurahPeriodIcon({
    title,
    variant = "outlined",
    period,
    style,
    ref,
}: SurahPeriodIconProps) {
    const isFilled = variant === "filled";

    const MakkahIcon = isFilled ? MakkahFilledIcon : MakkahOutlinedIcon;
    const MadinehIcon = isFilled ? MadinehFilledIcon : MadinehOutlinedIcon;

    const Icon = period === "makki" ? MakkahIcon : MadinehIcon;
    const dynamicTitle = period === "makki" ? "Makki" : "Madani";

    return (
        <SvgIcon
            ref={ref}
            title={title || dynamicTitle}
            style={{ cursor: "help", ...style }}
        >
            <Icon />
        </SvgIcon>
    );
}
