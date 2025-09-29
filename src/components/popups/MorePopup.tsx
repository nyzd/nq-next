import { forwardRef } from "react";
import { Button, Popup, PopupProps, Stack, Text } from "@yakad/ui";

export const MorePopup = forwardRef<HTMLDivElement, PopupProps>(
    function MorePopup({ ...restProps }, ref) {
        return (
            <Popup
                ref={ref}
                {...restProps}
                align="center"
            >
                <Text variant="heading3">Al-Fatihah:4</Text>
                <Stack align="center" style={{ flexGrow: 1 }}>
                    <Button>Share</Button>
                    <Button>Favorite</Button>
                </Stack>
            </Popup>
        );
    }
);
