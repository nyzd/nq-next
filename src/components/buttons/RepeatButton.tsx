import { Button, ButtonProps, Dropdown, WithOverlay } from "@yakad/ui";
import { forwardRef } from "react";
import { IconCode, Symbol } from "@yakad/symbols";
import { RepeatRange, useOptions } from "@/contexts/optionsContext";

const decideRepeatMode = (current_repeat_mode: "off" | "range" | "ayah") =>
    current_repeat_mode === "off" ? "ayah" : current_repeat_mode  === "ayah" ? "range" : "off";

const repeateRangeNames = {
    "off": "Continues",
    "ayah": "Ayah",
}

export const RepeatButton = forwardRef<HTMLButtonElement, ButtonProps>(
    function RepeatButton({ ...restProps }, ref) {
        const [options, setOptions] = useOptions();

        const onClickHandler = () => {
            setOptions((prev) => (
                {
                    ...prev,
                    repeatMode: decideRepeatMode(options.repeatMode)
                }
            ));
        };

        const setRepeatRange = (new_range: RepeatRange) => {
            setOptions((prev) => (
                {
                    ...prev,
                    repeatMode: "range",
                    repeatRange: new_range,
                }
            ));
        }

        const variant = (range: RepeatRange) => {
            return options.repeatRange === range
                ? options.repeatMode === "range" 
                    ? "filled" : "tonal"
                : "text";
        }

        const modeVariant = (mode: "off" | "ayah") =>
            options.repeatMode === mode ? "filledtonal" : "text"

        const repeatModeItemsOnClickHandler = (mode: "ayah" | "off") => {
            setOptions((prev) => (
                {
                    ...prev,
                    repeatMode: mode,
                }
            ));
        }
            

        return (
            <WithOverlay trigger="onRightClick" overlay={
                <Dropdown style={{minWidth: "18rem"}}>
                    {
                        ([["off", "arrow_right_alt"], ["ayah", "repeat_one"]] as (["off", IconCode] | ["ayah", IconCode])[])
                            .map((val, index)=> <Button key={index} variant={modeVariant(val[0])} size="small" icon={<Symbol icon={val[1]}/>} onClick={() => repeatModeItemsOnClickHandler(val[0])}>{repeateRangeNames[val[0]]}</Button>)
                    }
                    {
                        (["surah", "juz", "hizb", "ruku", "page"] as RepeatRange[])
                            .map((val, index) => <Button key={index} variant={variant(val)} size="small" icon={<Symbol icon={"repeat"}/>} onClick={() => setRepeatRange(val)}>{`${val.charAt(0).toUpperCase()}${val.slice(1)}`}</Button>)
                    }
               </Dropdown>
            }>
                <Button
                    ref={ref}
                    {...restProps}
                    variant={options.repeatMode === "off" ? "text" : "filledtonal"}
                    onClick={onClickHandler}
                    icon={
                        <Symbol
                            icon={options.repeatMode === "ayah" ? "repeat_one" : "repeat"}
                        />
                    }
                />
            </WithOverlay>
        )
    }
);