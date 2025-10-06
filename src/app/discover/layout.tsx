"use client";

import { Container, Main, Screen } from "@yakad/ui";
import { PlayBox } from "@/components";
import FooterWrapper from "./FooterWrapper";
import { useOptions } from "@/contexts/optionsContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [ options ] = useOptions();

    return (
        <Screen>
            <Main>{children}</Main>
            {options.playBoxShow && (
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
