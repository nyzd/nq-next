import { Container, H2, P } from "@yakad/ui";

export default function RandomSection() {
    return (
        <>
            <Container size="md">
                <H2 variant="heading4">Random</H2>
                {/* <RandomSurahButton /> */}
                <P>Tabs: random Ayah, Surah, Page</P>
                <P>A mechanism of scrolling to find a random ayyah</P>
                <P>
                    Methods: with random number generator algorithms, with user
                    touch or scroll
                </P>
            </Container>
        </>
    );
}
