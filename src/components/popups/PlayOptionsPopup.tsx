import { forwardRef } from "react";
import { CheckBox, Popup, PopupProps, Row, Select, Spacer, Text } from "@yakad/ui";
import { useStorage } from "@/contexts/storageContext";

export const PlayOptionsPopup = forwardRef<HTMLDivElement, PopupProps>(
    function PlayOptionsPopup({ ...restProps }, ref) {
        const { storage, setStorage } = useStorage();
        const handleCheckBoxChange = (
            e: React.ChangeEvent<HTMLInputElement>
        ) => {
            const { name, checked } = e.target;
            setStorage((prev) => ({
                ...prev,
                options: {
                    ...prev.options,
                    [name]: checked,
                },
            }));
        };

        return (
            <Popup ref={ref} {...restProps}>
                <Row>
                    <Text variant="heading5">Recite</Text>
                    <Spacer />
                    <CheckBox
                        title="Recitation play status"
                        name="recitationStatus"
                        checked={storage.options.recitationStatus}
                        onChange={handleCheckBoxChange}
                    />
                </Row>
                <Select
                    title="Reciter - Reciting type"
                    placeholder="Reciter"
                    disabled
                >
                    <option value="uuid">Abd-OlBasit</option>
                </Select>
                <Text variant="heading5">Auto scroll</Text>
                <CheckBox
                    label="Auto scroll"
                    name="autoScroll"
                    checked={storage.options.autoScroll}
                    onChange={handleCheckBoxChange}
                />
            </Popup>
        );
    }
);
