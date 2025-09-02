"use client";

import { forwardRef, useState } from "react";
import { Button, InputField, Row, Select, Text } from "@yakad/ui";
import { Xpopup, XpopupProps } from "@yakad/x";
import { Surah } from "@ntq/sdk";

interface FindPopupProps extends XpopupProps {
    surahs: Surah[];
    onButtonClicked: (surah_num: number, ayah_num: number) => void;
}

export const FindPopup = forwardRef<HTMLDivElement, FindPopupProps>(
    function FindPopup({ surahs, onButtonClicked, ...restProps }, ref) {
        const [currentSurah, setCurrentSurah] = useState<number>();

        return (
            <Xpopup ref={ref} {...restProps}>
                <Text variant="heading5">By Surah</Text>
                <Row>
                    <Select placeholder="Surah" onChange={(e) => setCurrentSurah(+e.target.value)}>
                        {
                            surahs.map(surah => <option value={surah.number}>{(surah.names[0] as any).name}</option>)
                        }
                    </Select>
                    <Select placeholder="Ayah">
                        {
                            [...new Array(surahs.find(surah => surah.number === currentSurah)?.number_of_ayahs)].map((_, index) => <option value={index + 1}>{index + 1}</option>)
                        }
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
                    <Button variant="filled" onClick={() => onButtonClicked(currentSurah || 0, 5)}>
                        Find
                    </Button>
                </Row>
            </Xpopup>
        );
    }
);
