import { Button, ButtonProps, Dropdown, WithOverlay } from "@yakad/ui";
import { forwardRef } from "react";
import { IconCode, Symbol } from "@yakad/symbols";
import { RepeatRange, usePlayOptions } from "@/contexts/playOptionsContext";

const decideRepeatMode = (current_repeat_mode: "off" | "range" | "ayah") =>
    current_repeat_mode === "off"
        ? "ayah"
        : current_repeat_mode === "ayah"
        ? "range"
        : "off";

const repeateRangeNames = {
    off: "Continues",
    ayah: "Ayah",
};

export const RepeatButton = forwardRef<HTMLButtonElement, ButtonProps>(
    function RepeatButton({ ...restProps }, ref) {
        const [playOptions, setPlayOptions] = usePlayOptions();

        const onClickHandler = () => {
            setPlayOptions((prev) => ({
                ...prev,
                repeatMode: decideRepeatMode(playOptions.repeatMode),
            }));
        };

        const setRepeatRange = (new_range: RepeatRange) => {
            setPlayOptions((prev) => ({
                ...prev,
                repeatMode: "range",
                repeatRange: new_range,
            }));
        };

        const variant = (range: RepeatRange) => {
            return playOptions.repeatRange === range
                ? playOptions.repeatMode === "range"
                    ? "filled"
                    : "tonal"
                : "text";
        };

        const modeVariant = (mode: "off" | "ayah") =>
            playOptions.repeatMode === mode ? "filledtonal" : "text";

        const repeatModeItemsOnClickHandler = (mode: "ayah" | "off") => {
            setPlayOptions((prev) => ({
                ...prev,
                repeatMode: mode,
            }));
        };

        return (
            <WithOverlay
                trigger="onRightClick"
                overlay={
                    <Dropdown style={{ minWidth: "18rem" }}>
                        {(
                            [
                                ["off", "arrow_right_alt"],
                                ["ayah", "repeat_one"],
                            ] as (["off", IconCode] | ["ayah", IconCode])[]
                        ).map((val, index) => (
                            <Button
                                key={index}
                                variant={modeVariant(val[0])}
                                size="small"
                                icon={<Symbol icon={val[1]} />}
                                onClick={() =>
                                    repeatModeItemsOnClickHandler(val[0])
                                }
                            >
                                {repeateRangeNames[val[0]]}
                            </Button>
                        ))}
                        {(
                            [
                                "surah",
                                "juz",
                                "hizb",
                                "ruku",
                                "page",
                            ] as RepeatRange[]
                        ).map((val, index) => (
                            <Button
                                key={index}
                                variant={variant(val)}
                                size="small"
                                icon={<Symbol icon={"repeat"} />}
                                onClick={() => setRepeatRange(val)}
                            >{`${val.charAt(0).toUpperCase()}${val.slice(
                                1
                            )}`}</Button>
                        ))}
                    </Dropdown>
                }
            >
                <Button
                    ref={ref}
                    {...restProps}
                    variant={
                        playOptions.repeatMode === "off"
                            ? "text"
                            : "filledtonal"
                    }
                    onClick={onClickHandler}
                    icon={
                        <Symbol
                            icon={
                                playOptions.repeatMode === "ayah"
                                    ? "repeat_one"
                                    : "repeat"
                            }
                        />
                    }
                />
            </WithOverlay>
        );
    }
);
