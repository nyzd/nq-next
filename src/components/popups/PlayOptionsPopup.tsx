"use client";

import { forwardRef, useEffect, useState } from "react";
import {
    CheckBox,
    LoadingIcon,
    Popup,
    PopupProps,
    Row,
    Select,
    Spacer,
    Text,
} from "@yakad/ui";
import { usePlayOptions } from "@/contexts/playOptionsContext";
import { getRecitations } from "@/actions/getRecitations";
import { PaginatedRecitationListList } from "@ntq/sdk";
export const PlayOptionsPopup = forwardRef<HTMLDivElement, PopupProps>(
    function PlayOptionsPopup({ ...restProps }, ref) {
        const [playOptions, setPlayOptions] = usePlayOptions();
        const [recitations, setRecitations] =
            useState<PaginatedRecitationListList>([]);
        const [recitationsLoading, setRecitationsLoading] = useState(true);
        useEffect(() => {
            getRecitations("hafs", 100).then((res) => {
                setRecitations(res);
                setRecitationsLoading(false);
            });
        }, []);

        const handleCheckBoxChange = (
            e: React.ChangeEvent<HTMLInputElement>
        ) => {
            const { name, checked } = e.target;
            setPlayOptions((prev) => ({
                ...prev,
                [name]: checked,
            }));
        };

        return (
            <Popup ref={ref} {...restProps}>
                <Row>
                    <Text variant="heading5">Recite</Text>
                    <Spacer />
                </Row>
                {recitations.length <= 0 && !recitationsLoading ? (
                    "No recitation Found!"
                ) : !recitationsLoading ? (
                    <Select
                        title="Reciter - Reciting type"
                        placeholder="Reciter"
                        disabled={recitationsLoading}
                    >
                        {recitations.map((recitation, index) => (
                            <option key={index}>
                                {recitation.reciter_account_uuid}
                            </option>
                        ))}
                    </Select>
                ) : (
                    <LoadingIcon />
                )}

                <Text variant="heading5">Auto scroll</Text>
                <CheckBox
                    label="Auto scroll"
                    name="autoScroll"
                    checked={playOptions.autoScroll}
                    onChange={handleCheckBoxChange}
                />
            </Popup>
        );
    }
);
