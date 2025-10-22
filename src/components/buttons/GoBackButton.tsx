"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "@yakad/ui";
import { Symbol } from "@yakad/symbols";

export function GoBackButton({
    title,
    icon,
    onClick,
    children,
    ...restProps
}: ButtonProps) {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <Button
            title={title || "Go back"}
            icon={icon || <Symbol icon="arrow_back" />}
            onClick={(e) => {
                handleGoBack();
                onClick?.(e);
            }}
            {...restProps}
        >
            {children}
        </Button>
    );
}
