"use client";

import { useOptions } from "@/contexts/optionsContext";
import { useEffect, useRef } from "react";

export function Audio(
    restProps: Omit<React.HTMLAttributes<HTMLAudioElement>, "style">
) {
    const [options, setOptions] = useOptions();
    const isPlaying = options.playing;

    const playBackActive = options.playBackActive;
    const playBackRate = options.playBackRate;
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Update playback rate when playBackRate changes
    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.playbackRate = playBackActive ? playBackRate : 1;
    }, [playBackRate, playBackActive]);

    const handleEnded = () => {
        console.log("Audio has ended");

        setOptions((prev) => ({
            ...prev,
            playing: false,
        }));
    };

    return (
        <audio
            ref={audioRef}
            {...restProps}
            controls
            src="https://ia601507.us.archive.org/5/items/Tareq-Mohammad/001.mp3"
            style={{ display: "none" }}
            onEnded={handleEnded}
        />
    );
}
