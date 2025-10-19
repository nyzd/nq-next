"use client";

import {
    AppBar,
    AppBarProps,
    Button,
    H1,
    Spacer,
    WithOverlay,
} from "@yakad/ui";
import { Symbol } from "@yakad/symbols";
import { GoBackButton, MushafOptionsPopup } from "@/components";

export default function AppBarWrapper({
    position = "scroll",
    size = "md",
    blur = true,
    ...restProps
}: Omit<AppBarProps, "children">) {
    return (
        <AppBar {...restProps} position={position} size={size} blur={blur}>
            <GoBackButton title="Go back" icon={<Symbol icon="arrow_back" />} />
            <Spacer />
            <H1 variant="heading4" title="Natiq Quran">
                Natiq
            </H1>
            <Spacer />
            <WithOverlay
                overlay={<MushafOptionsPopup heading="Mushaf options" />}
            >
                <Button
                    title="Mushaf Options"
                    icon={<Symbol type="outlined" icon="settings" />}
                />
            </WithOverlay>
        </AppBar>
    );
}
