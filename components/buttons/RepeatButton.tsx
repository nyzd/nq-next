import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Repeat2 } from "lucide-react";

type SkipType = "intro" | "verse" | "chorus" | "bridge" | "outro";
export function RepeatButton() {
    const [skipType, setSkipType] = useState<SkipType>("verse");
    const [skipModeOn, setSkipModeOn] = useState<boolean>(false);

    const skipTypes: SkipType[] = [
        "intro",
        "verse",
        "chorus",
        "bridge",
        "outro",
    ];

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={skipModeOn ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSkipModeOn((prev) => !prev)}
                    onContextMenu={(e) => {
                        e.preventDefault();
                    }}
                >
                    <Repeat2 className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44" align="center" side="top">
                <div className="space-y-2">
                    <h4 className="font-medium text-sm">Repeat</h4>
                    <div className="grid gap-1">
                        <Button
                            variant={!skipModeOn ? "default" : "ghost"}
                            size="sm"
                            className="justify-start"
                            onClick={() => setSkipModeOn(false)}
                        >
                            Continuous
                        </Button>
                        {skipTypes.map((type) => (
                            <Button
                                key={type}
                                variant={
                                    skipModeOn && skipType === type
                                        ? "default"
                                        : "ghost"
                                }
                                size="sm"
                                className="justify-start"
                                onClick={() => {
                                    setSkipModeOn(true);
                                    setSkipType(type);
                                }}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Button>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
