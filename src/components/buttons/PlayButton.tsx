"use client";

import { forwardRef } from "react";
import { Button, ButtonProps } from "@yakad/ui";
import { Symbol } from "@yakad/symbols";
import { usePlayOptions } from "@/contexts/playOptionsContext";

export const PlayButton = forwardRef<HTMLButtonElement, ButtonProps>(
    function PlayButton({ title, icon, onClick, ...restProps }, ref) {
        const [playOptions, setPlayOptions] = usePlayOptions();

        const togglePlay = () => {
            setPlayOptions((prev) => ({
                ...prev,
                playing: !playOptions.playing,
                playBoxShow: true,
            }));
        };

        return (
            <Button
                ref={ref}
                {...restProps}
                title={title || playOptions.playing ? "Pause" : "Play"}
                icon={
                    icon || (
                        <Symbol
                            icon={playOptions.playing ? "pause" : "play_arrow"}
                            filled
                        />
                    )
                }
                onClick={(e) => {
                    togglePlay();
                    onClick?.(e);
                }}
            />
        );
    }
);
