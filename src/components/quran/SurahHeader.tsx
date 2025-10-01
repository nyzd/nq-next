import { Container, P } from "@yakad/ui";

interface SurahHeaderProps {
    surah?: {
        uuid?: string;
        names?: { name?: string }[];
        number_of_ayahs?: number | string;
        bismillah?: {
            text?: string;
            is_ayah?: boolean;
        };
    };
    bismillah: (surah: SurahHeaderProps["surah"]) => React.ReactNode;
}

export default function SurahHeader({ surah, bismillah }: SurahHeaderProps) {
    if (!surah) return null;

    return (
        <Container
            size="sm"
            align="center"
            style={{ marginBottom: "1.5rem" }}
        >
            <P variant="heading6" style={{ marginBottom: "0.5rem" }}>
                {(surah?.names || [{ name: "NOTFOUND" }])[0]?.name ||
                    "Name Not found!"}
            </P>
            <P variant="body2" style={{ color: "#666" }}>
                {surah?.number_of_ayahs} Ayahs
            </P>
            {(
                <P
                    variant="body1"
                    style={{
                        direction: "rtl",
                        textAlign: "right",
                        marginTop: "1rem",
                        fontStyle: "italic",
                    }}
                >
                    {bismillah(surah)}
                </P>
            )}
        </Container>
    );
}