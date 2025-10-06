"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { Button, ButtonProps } from "@yakad/ui";
import { useSelected } from "@/contexts/selectedsContext";


export const LastReadingButton = forwardRef<HTMLButtonElement, ButtonProps>(
    function LastReadingButton({ disabled, children, ...restProps }, ref) {
        const [selected, setSelected] = useSelected();

        return (
            <Link
                href={`/quran?ayah_uuid=${selected.ayahUUID}`}
                passHref
            >
                <Button
                    ref={ref}
                    {...restProps}
                    disabled={
                        disabled || selected.ayahUUID === undefined
                    }
                >
                    {children || "Last reading"}
                </Button>
            </Link>
        );
    }
);
