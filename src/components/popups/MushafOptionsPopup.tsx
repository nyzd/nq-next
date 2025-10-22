import {
    Row,
    Select,
    Text,
    GridContainer,
    GridItem,
    PopupProps,
    Popup,
} from "@yakad/ui";
import { DarkStyleButton, ColorButton } from "@/components";
import { ZoomButton } from "../buttons/ZoomButton";
import { useMushafOptions } from "@/contexts/mushafOptionsContext";
import { TranslationSelect } from "../forms/TranslationSelect";

export function MushafOptionsPopup({ ...restProps }: PopupProps) {
    const [mushafOptions, setMushafOptions] = useMushafOptions();
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const castedValue = isNaN(Number(value)) ? value : Number(value);
        setMushafOptions((prev) => ({
            ...prev,
            [name]: castedValue,
        }));
    };

    return (
        <Popup {...restProps}>
            <Text variant="heading5">Arabic Text</Text>
            <Row>
                <Select
                    placeholder="Font"
                    name="arabicFont"
                    value={mushafOptions.arabicFont}
                    onChange={handleSelectChange}
                >
                    <option value="tahoma">Tahoma</option>
                </Select>
                <Select
                    placeholder="Font size"
                    name="arabicFontSize"
                    value={mushafOptions.arabicFontSize}
                    onChange={handleSelectChange}
                >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                </Select>
                <Select
                    placeholder="Text align"
                    name="textAlign"
                    value={mushafOptions.textAlign}
                    onChange={handleSelectChange}
                >
                    <option value="normal">Normal</option>
                    <option value="center">Center</option>
                </Select>
            </Row>
            <Text variant="heading5">Translate</Text>
            <TranslationSelect />
            <Select
                placeholder="Translation Font size"
                name="translationFontSize"
                value={mushafOptions.translationFontSize}
                onChange={handleSelectChange}
            >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
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
