"use client";

import { Container, Main, Screen } from "@yakad/ui";
import { PlayBox } from "@/components";
import FooterWrapper from "./FooterWrapper";
import { usePlayOptions } from "@/contexts/playOptionsContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [playOptions] = usePlayOptions();

    return (
        <Screen>
            <Main>{children}</Main>
            {playOptions.playBoxShow && (
                <Container
                    size="md"
                    style={{
                        position: "sticky",
                        bottom: "6rem",
                    }}
                >
                    <PlayBox />
                </Container>
            )}
            <FooterWrapper />
        </Screen>
    );
}
