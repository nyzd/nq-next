import Link from "next/link";
import { SurahsListResponse } from "@ntq/sdk";
import { Button, ButtonProps } from "@yakad/ui";

interface RandomSurahButtonProps extends ButtonProps {
    surahList: SurahsListResponse;
    surahNumber: number;
}

export function GoToSurahButton({
    surahList,
    surahNumber,
    ...restProps
}: RandomSurahButtonProps) {
    return (
        <Link href={`/quran?surah_uuid=${surahList[surahNumber - 1].uuid}`}>
            <Button {...restProps}>
                {surahList[surahNumber - 1].names[0].name}
            </Button>
        </Link>
    );
}
