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
        const [currentAyah, setCurrentAyah] = useState<number>();

        return (
            <Xpopup ref={ref} {...restProps}>
                <Text variant="heading5">By Surah</Text>
                <Row>
                    <Select placeholder="Surah" onChange={(e) => setCurrentSurah(+e.target.value)}>
                        {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            surahs.map(surah => <option key={surah.number} value={surah.number}>{surah.names[0]?.name}</option>)
                        }
                    </Select>
                    <Select placeholder="Ayah" onChange={(e) => setCurrentAyah(+e.target.value)}>
                        {
                            [...new Array(surahs.find(surah => surah.number === currentSurah)?.number_of_ayahs || 0)].map((_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)
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
                    <Button variant="filled" onClick={() => onButtonClicked(currentSurah || 1, currentAyah || 1)}>
                        Find
                    </Button>
                </Row>
            </Xpopup>
        );
    }
);
