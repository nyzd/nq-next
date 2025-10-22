"use client";

import { Button, ButtonProps } from "@yakad/ui";
import { useState } from "react";

export function ResetButton({ children, onClick, ...restProps }: ButtonProps) {
    const [reseting, setReseting] = useState(false);

    const handleReset = () => {
        setReseting(true);
        localStorage.clear();
        window.location.reload();
        window.location.href = "/";
    };

    return (
        <Button
            {...restProps}
            onClick={(e) => {
                onClick?.(e);
                handleReset();
            }}
            disabled={reseting}
        >
            {children || reseting ? "Resetting..." : "Reset everything"}
        </Button>
    );
}
