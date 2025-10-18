import { Button, ButtonProps, Dropdown, WithOverlay } from "@yakad/ui";
import { forwardRef } from "react";
import { IconCode, Symbol } from "@yakad/symbols";
import { PlayBackRate, usePlayOptions } from "@/contexts/playOptionsContext";

const playBackButtonIcon: Record<PlayBackRate, IconCode> = {
    0.5: "speed_0_5",
    1: "1x_mobiledata",
    1.25: "speed_1_25",
    1.5: "speed_1_5",
    1.75: "speed_1_75",
    2: "speed_2x",
};

type PlayBackButtonProps = Omit<ButtonProps, "variant" | "icon" | "onClick">;

export const PlayBackButton = forwardRef<
    HTMLButtonElement,
    PlayBackButtonProps
>(function PlayBackButton({ ...restProps }, ref) {
    const [playOptions, setPlayOptions] = usePlayOptions();

    const onClickHandler = () => {
        setPlayOptions((prev) => ({
            ...prev,
            playBackActive: !prev.playBackActive,
        }));
    };

    const setPlayBackRate = (newRate: PlayBackRate) => {
        if (newRate === 1) {
            setPlayOptions((prev) => ({
                ...prev,
                playBackActive: false,
            }));

            return;
        }

        setPlayOptions((prev) => ({
            ...prev,
            playBackActive: true,
            playBackRate: newRate,
        }));
    };

    const variant = (rate: PlayBackRate): ButtonProps["variant"] => {
        if (rate === 1)
            return !playOptions.playBackActive ? "filledtonal" : "text";

        return playOptions.playBackRate === rate
            ? playOptions.playBackActive
                ? "filled"
                : "tonal"
            : "text";
    };

    return (
        <WithOverlay
            trigger="onRightClick"
            overlay={
                <Dropdown style={{ minWidth: "18rem" }}>
                    {(
                        [
                            [0.5, "Slow"],
                            [1, "Normal"],
                            [1.25, "Medium"],
                            [1.5, "Fast"],
                            [1.75, "Very fast"],
                            [2, "Super fast"],
                        ] as [PlayBackRate, string][]
                    ).map((rate, index) => (
                        <Button
                            key={index}
                            icon={<Symbol icon={playBackButtonIcon[rate[0]]} />}
                            size="small"
                            variant={variant(rate[0])}
                            onClick={() => setPlayBackRate(rate[0])}
                        >
                            {rate[1]}
                        </Button>
                    ))}
                </Dropdown>
            }
        >
            <Button
                ref={ref}
                {...restProps}
                variant={playOptions.playBackActive ? "filledtonal" : "text"}
                icon={
                    <Symbol
                        icon={
                            playOptions.playBackActive
                                ? playBackButtonIcon[playOptions.playBackRate]
                                : playBackButtonIcon[1]
                        }
                    />
                }
                onClick={onClickHandler}
            />
        </WithOverlay>
    );
});
