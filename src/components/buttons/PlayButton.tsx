"use client";

import { forwardRef } from "react";
import { Button, ButtonProps } from "@yakad/ui";
import { Symbol } from "@yakad/symbols";
import { useOptions } from "@/contexts/optionsContext";

export const PlayButton = forwardRef<HTMLButtonElement, ButtonProps>(
    function PlayButton({ title, icon, onClick, ...restProps }, ref) {
        const [options, setOptions] = useOptions();

        const togglePlay = () => {
            setOptions((prev) => ({
                ...prev,
                playing: !options.playing,
                playBoxShow: true,
            }));
        };

        return (
            <Button
                ref={ref}
                {...restProps}
                title={title || options.playing ? "Pause" : "Play"}
                icon={
                    icon || (
                        <Symbol
                            icon={
                                options.playing ? "pause" : "play_arrow"
                            }
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
