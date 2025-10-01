import { PlayBackRate, useStorage } from "@/contexts/storageContext";
import { Button, ButtonProps, Dropdown, Popup, WithOverlay } from "@yakad/ui";
import { forwardRef } from "react";
import {Symbol} from "@yakad/symbols";


const playBackButtonIcon = (playBackRate: number) => {
    switch (playBackRate) {
        case 0.5:
            return <Symbol icon="javascript" />

        case 0.75:
            return <Symbol icon="10k" />

        case 1.25:
            return <Symbol icon="10mp" />

        case 1.5:
            return <Symbol icon="11mp" />

        case 1.75:
            return <Symbol icon="12mp" />
            
        case 2:
            return <Symbol icon="11mp" />

        default:
            return <Symbol icon="1x_mobiledata" />
    }
}

export const PlayBackButton = forwardRef(({ ...restProps }, ref) => {
    const { storage, setStorage } = useStorage();

    const onButtonClicked = () => {
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
                    ([0.5, 0.75, 1, 1.5, 1.75, 2] as PlayBackRate[])
                        .map((rate, index) => <Button key={index} variant={variant(rate)} onClick={() => setPlayBackRate(rate)}>{rate}x</Button>)
                }
            </Dropdown>
        }>
            <Button 
                variant={storage.options.playBackActive ? "tonal" : "text"} 
                icon={playBackButtonIcon(storage.options.playBackRate)} 
                onClick={onButtonClicked} 
            />
        </WithOverlay>
    )
});