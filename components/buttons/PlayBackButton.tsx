import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Gauge } from "lucide-react";

export function PlayBackButton() {
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const speedOptions = [
        [0.5, "Slow"],
        [1, "Normal"],
        [1.25, "Medium"],
        [1.5, "Fast"],
        [1.75, "Very fast"],
        [2, "Super fast"],
    ];
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Gauge className="h-10 w-10" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40" align="center" side="top">
                <div className="space-y-2">
                    <h4 className="font-medium text-sm">Playback Speed</h4>
                    <div className="grid gap-1">
                        {speedOptions.map(([speed, desc]) => (
                            <Button
                                key={speed}
                                variant={
                                    playbackSpeed === speed
                                        ? "default"
                                        : "ghost"
                                }
                                size="sm"
                                className="justify-start"
                                onClick={() =>
                                    setPlaybackSpeed(speed as number)
                                }
                            >
                                {speed}x<p>{desc}</p>
                            </Button>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
