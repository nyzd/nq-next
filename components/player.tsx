"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

import { PlayBackButton } from "./buttons/PlayBackButton";
import { RepeatButton } from "./buttons/RepeatButton";
import { PlayerSettingsButton } from "./buttons/PlayerSettingsButton";

export function Player() {
    const [isPlaying, setIsPlaying] = useState(false);
    return (
        <footer className="sticky bottom-0 left-0 right-0 border-t bg-background/65 backdrop-blur supports-[backdrop-filter]:bg-background/65">
            <div className="flex items-center gap-2 h-20 justify-center">
                <PlayerSettingsButton />
                <PlayBackButton />
                <Button
                    variant="default"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setIsPlaying(!isPlaying)}
                >
                    {isPlaying ? (
                        <Pause className="h-5 w-5" />
                    ) : (
                        <Play className="h-5 w-5" />
                    )}
                </Button>

                <RepeatButton />
            </div>
        </footer>
    );
}
