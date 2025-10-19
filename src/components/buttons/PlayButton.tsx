"use client";

import { Button, ButtonProps } from "@yakad/ui";
import { Symbol } from "@yakad/symbols";
import { usePlayOptions } from "@/contexts/playOptionsContext";

export function PlayButton({
    title,
    icon,
    onClick,
    ...restProps
}: ButtonProps) {
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
