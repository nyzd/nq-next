import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { IconCode, Symbol } from "@yakad/symbols";

type SpeedOption = {
    value: number;
    label: string;
    icon: string;
};

const speedOptions: SpeedOption[] = [
    { value: 0.5, label: "Slow", icon: "speed_0_5x" },
    { value: 1, label: "Normal", icon: "1x_mobiledata" },
    { value: 1.25, label: "Medium", icon: "speed_1_25" },
    { value: 1.5, label: "Fast", icon: "speed_1_5x" },
    { value: 1.75, label: "Very fast", icon: "speed_1_75" },
    { value: 2, label: "Super fast", icon: "speed_2x" },
];

export function PlayBackButton() {
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const currentIcon: IconCode =
        (speedOptions.find((option) => option.value === playbackSpeed)
            ?.icon as IconCode) ?? "speed";
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={playbackSpeed === 1 ? "ghost" : "default"}
                    size="icon-lg"
                >
                    <Symbol icon={currentIcon} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40" align="center" side="top">
                <div className="space-y-2">
                    <h4 className="font-medium text-sm">Playback Speed</h4>
                    <div className="grid gap-1">
                        {speedOptions.map(({ value, label }) => (
                            <Button
                                key={value}
                                variant={
                                    playbackSpeed === value
                                        ? "default"
                                        : "ghost"
                                }
                                size="sm"
                                className="justify-start"
                                onClick={() => setPlaybackSpeed(value)}
                            >
                                {value}x<p>{label}</p>
                            </Button>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
