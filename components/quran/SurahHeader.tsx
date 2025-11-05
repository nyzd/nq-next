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
        <div className="mb-1.5 text-center">
            <p style={{ marginBottom: "0.5rem" }}>
                {(surah?.names || [{ name: "NOTFOUND" }])[0]?.name ||
                    "Name Not found!"}
            </p>
            <p style={{ color: "#666" }}>{surah?.number_of_ayahs} Ayahs</p>

            {bismillah(surah)}
        </div>
    );
}
