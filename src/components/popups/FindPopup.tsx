"use client";

import { forwardRef, useState } from "react";
import { Button, InputField, Row, Select, Text } from "@yakad/ui";
import { Xpopup, XpopupProps } from "@yakad/x";

interface FindPopupProps extends XpopupProps {
    surahs_with_ayahs_number: {surah_name: string, number_of_ayahs: number,}[];
    onButtonClicked: (surah_name: string, ayah_num: number) => void;
}

export const FindPopup = forwardRef<HTMLDivElement, FindPopupProps>(
    function FindPopup({ surahs_with_ayahs_number, onButtonClicked, ...restProps }, ref) {
        const [currentSurah, setCurrentSurah] = useState();

        return (
            <Xpopup ref={ref} {...restProps}>
                <Text variant="heading5">By Surah</Text>
                <Row>
                    <Select placeholder="Surah" onChange={(e) => e.target.value}>
                        {
                            surahs_with_ayahs_number.map(surah => <option value="uuid">{surah.surah_name}</option>)
                        }
                    </Select>
                    <Select placeholder="Ayah">
                    </Select>
                </Row>
                <Text variant="heading5">By Juz/Hizb/Ruku</Text>
                <Row>
                    <Select placeholder="Juz">
                        <option value={1}>1</option>
                    </Select>
                    <Select placeholder="Hizb">
                        <option value={1}>1</option>
                    </Select>
                    <Select placeholder="Ruku">
                        <option value={1}>1</option>
                    </Select>
                </Row>
                <Text variant="heading5">By Page</Text>
                <Row>
                    <InputField placeholder="Page" defaultValue={1} />
                </Row>
                <Row align="center">
                    <Button variant="filled" onClick={() => onButtonClicked(5)}>
                        Find
                    </Button>
                </Row>
            </Xpopup>
        );
    }
);
