"use client";

import { Button, Footer, FooterProps, WithOverlay } from "@yakad/ui";
import { Symbol } from "@yakad/symbols";
import { PlayButton, PlayOptionsPopup } from "@/components";
import { PlayBackButton } from "@/components/quran/PlayBackButton";

export default function FooterWrapper({
    style,
    ...restProps
}: Omit<FooterProps, "children">) {
    return (
        <>
            <Footer
                position="sticky"
                align="space"
                size="md"
                blur
                style={{
                    borderTop:
                        "0.3rem solid rgb(var(--primaryColor,11 87 208))",
                    minHeight: "7rem",
                    ...style,
                }}
                {...restProps}
            >
            <WithOverlay overlay={
                <PlayOptionsPopup
                    heading="Playing options"
                />
            }>
                <Button
                    title="Options"
                    icon={<Symbol icon="tune" />}
                />
            </WithOverlay>
                {/* <Button
                    title="Previous Ayah"
                    icon={<Symbol icon="chevron_left" />}
                /> */}
                <PlayBackButton />
                <PlayButton variant="filled" />
                <Button
                    title="Next Ayah"
                    icon={<Symbol icon="chevron_right" />}
                />
                <Button
                    title="Fillscreen"
                    icon={<Symbol icon="fullscreen" />}
                />
            </Footer>
            
        </>
    );
}
