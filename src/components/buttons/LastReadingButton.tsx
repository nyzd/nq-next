"use client";

import Link from "next/link";
import { Button, ButtonProps } from "@yakad/ui";
import { useSelected } from "@/contexts/selectedsContext";

export function LastReadingButton({
    disabled,
    children,
    ...restProps
}: ButtonProps) {
    const [selected] = useSelected();

    return (
        <Link href="/quran">
            <Button
                {...restProps}
                disabled={disabled || selected.ayahUUID === undefined}
            >
                {children || "Last reading"}
            </Button>
        </Link>
    );
}
