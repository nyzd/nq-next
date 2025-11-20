"use client";

import { Button } from "@/components/ui/button";
import { usePlayOptions } from "@/contexts/playOptionsContext";
import { Symbol } from "@yakad/symbols";

export function PlayButton() {
    const [playOptions, setPlayOptions] = usePlayOptions();

    const togglePlaying = () => {
        setPlayOptions((prev) => ({
            ...prev,
            playing: !prev.playing,
        }));
    };

    return (
        <Button variant="default" size="icon-lg" onClick={togglePlaying}>
            {playOptions.playing ? (
                <Symbol icon="pause" filled />
            ) : (
                <Symbol icon="play_arrow" filled />
            )}
        </Button>
    );
}
