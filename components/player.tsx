"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

import { PlayBackButton } from "./buttons/PlayBackButton";
import { RepeatButton } from "./buttons/RepeatButton";
import { PlayerSettingsButton } from "./buttons/PlayerSettingsButton";
import { Symbol } from "@yakad/symbols";

export function Player() {
    const [isPlaying, setIsPlaying] = useState(false);
    return (
        <footer className="sticky bottom-0 left-0 right-0 border-t bg-background/65 backdrop-blur supports-[backdrop-filter]:bg-background/65 z-50">
            <div className="flex items-center gap-12 p-3.5 justify-center">
                <PlayerSettingsButton />
                <PlayBackButton />
                <Button
                    variant="default"
                    size="icon-lg"
                    onClick={() => setIsPlaying(!isPlaying)}
                >
                    {isPlaying ? (
                        <Symbol icon="pause" filled />
                    ) : (
                        <Symbol icon="play_arrow" filled />
                    )}
                </Button>

                <RepeatButton />

                <Button size="icon-lg" variant="ghost">
                    <Symbol icon="fullscreen" />
                </Button>
            </div>
        </footer>
    );
}
