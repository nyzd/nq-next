import { PlayBackRate, useStorage } from "@/contexts/storageContext";
import { Button, ButtonProps, Dropdown, WithOverlay } from "@yakad/ui";
import { forwardRef } from "react";
import {IconCode, Symbol} from "@yakad/symbols";


const playBackButtonIcon: Record<PlayBackRate, IconCode> = {
    0.5: "speed_0_5",
    0.75: "speed_0_75",
    1: "1x_mobiledata",
    1.25: "speed_1_25",
    1.5: "speed_1_5",
    1.75: "speed_1_75",
    2: "speed_2x"
};

type PlayBackButtonProps = Omit<ButtonProps, "variant" | "icon" | "onClick">

export const PlayBackButton = forwardRef<HTMLButtonElement, PlayBackButtonProps>(
    function PlayBackButton({ ...restProps }, ref) {
        const { storage, setStorage } = useStorage();

        const onClickHandler = () => {
            setStorage((prev) => (
                {
                    ...prev,
                    options: {
                        ...prev.options,
                        playBackActive: !prev.options.playBackActive
                    }
                }
            ));
        };

        const setPlayBackRate = (newRate: PlayBackRate) => {
            if (newRate === 1){ 
                setStorage(prev => ({
                    ...prev,
                    options: {
                        ...prev.options,
                        playBackActive: false
                    }
                }))

                return;
            }

            setStorage(prev => ({
                ...prev,
                options: {
                    ...prev.options,
                    playBackActive: true,
                    playBackRate: newRate
                }
            }));
        }

        const variant = (rate: PlayBackRate): ButtonProps["variant"] => {
            if (rate === 1)
                return !storage.options.playBackActive 
                    ? "filled" : "text";

            return storage.options.playBackRate === rate
                ? storage.options.playBackActive 
                    ? "filled" : "tonal"
                : "text";
        }

        return (
            <WithOverlay trigger="onRightClick" overlay={
                <Dropdown>
                    {
                        ([0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as PlayBackRate[])
                            .map((rate, index) => <Button key={index} size="small" variant={variant(rate)} onClick={() => setPlayBackRate(rate)}>{rate}x</Button>)
                    }
                </Dropdown>
            }>
                <Button 
                    ref={ref}
                    {...restProps}
                    variant={storage.options.playBackActive ? "tonal" : "text"} 
                    icon={<Symbol icon={playBackButtonIcon[storage.options.playBackRate] }/>} 
                    onClick={onClickHandler} 
                />
            </WithOverlay>
        )
});
