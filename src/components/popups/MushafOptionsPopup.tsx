import { forwardRef } from "react";
import { Row, Select, Text, GridContainer, GridItem, PopupProps, Popup } from "@yakad/ui";
import { DarkStyleButton, ColorButton } from "@/components";
import { ZoomButton } from "../buttons/ZoomButton";
import { useOptions } from "@/contexts/optionsContext";

export const MushafOptionsPopup = forwardRef<HTMLDivElement, PopupProps>(
    function MushafOptionsPopup({ ...restProps }, ref) {
        const [options, setOptions] = useOptions();
        const handleSelectChange = (
            e: React.ChangeEvent<HTMLSelectElement>
        ) => {
            const { name, value } = e.target;
            const castedValue = isNaN(Number(value)) ? value : Number(value);
            setOptions((prev) => ({
                ...prev,
                [name]: castedValue,
            }));
        };

        return (
            <Popup ref={ref} {...restProps}>
                <Text variant="heading5">Arabic Text</Text>
                <Row>
                    <Select
                        placeholder="Font"
                        name="arabicFont"
                        value={options.arabicFont}
                        onChange={handleSelectChange}
                    >
                        <option value="tahoma">Tahoma</option>
                    </Select>
                    <Select
                        placeholder="Font size"
                        name="arabicFontSize"
                        value={options.arabicFontSize}
                        onChange={handleSelectChange}
                    >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </Select>
                </Row>
                <Text variant="heading5">Translate</Text>
                <Select placeholder="Translation" disabled>
                    {/* OPTIONS */}
                </Select>
                <Text variant="heading5">Theme</Text>
                <GridContainer columns={3}>
                    <GridItem>
                        <DarkStyleButton variant="filled" />
                    </GridItem>
                    <GridItem>
                        <ColorButton variant="filled" />
                    </GridItem>
                    <GridItem>
                        <ZoomButton variant="filled" />
                    </GridItem>
                </GridContainer>
            </Popup>
        );
    }
);
