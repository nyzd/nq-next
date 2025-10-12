"use client";

import { forwardRef, useEffect, useState } from "react";
import { Button, ButtonProps, Dropdown, Select, WithOverlay } from "@yakad/ui";
import { Symbol } from "@yakad/symbols";
import { useOptions } from "@/contexts/optionsContext";
import { getRecitations } from "@/actions/getRecitations";
import { PaginatedRecitationListList } from "@ntq/sdk";

export const PlayButton = forwardRef<HTMLButtonElement, ButtonProps>(
    function PlayButton({ title, icon, onClick, ...restProps }, ref) {
        const [options, setOptions] = useOptions();
        const [recitations, setRecitations] = useState<PaginatedRecitationListList>([]);

        useEffect(()=>{
            getRecitations("hafs", 100)
                .then(res => setRecitations(res));
        }, []);

        const togglePlay = () => {
            setOptions((prev) => ({
                ...prev,
                playing: !options.playing,
                playBoxShow: true,
            }));
        };

        return (
            <WithOverlay trigger="onRightClick" overlay={
                <Dropdown>
                    {
                    recitations.length <= 0 ? "No recitation Found!" :
                        <Select>
                            {
                                recitations.map(
                                    (recitation, index) => 
                                        <option key={index}>{recitation.reciter_account_uuid}</option>
                                )
                            }
                        </Select>
                    }
                </Dropdown>
            }>
                <Button
                    ref={ref}
                    {...restProps}
                    title={title || options.playing ? "Pause" : "Play"}
                    icon={
                        icon || (
                            <Symbol
                                icon={
                                    options.playing ? "pause" : "play_arrow"
                                }
                                filled
                            />
                        )
                    }
                    onClick={(e) => {
                        togglePlay();
                        onClick?.(e);
                    }}
                />
            </WithOverlay>
        );
    }
);
