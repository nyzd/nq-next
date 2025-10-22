import Link from "next/link";
import { SurahsListResponse } from "@ntq/sdk";
import { Button, ButtonProps } from "@yakad/ui";

interface RandomSurahButtonProps extends ButtonProps {
    surahList: SurahsListResponse;
}

export function RandomSurahButton({
    surahList,
    children,
    ...restProps
}: RandomSurahButtonProps) {
    const surahLength = surahList.length;

    const randomNumber = Math.floor(Math.random() * surahLength);

    return (
        <Link href={`/quran?surah_uuid=${surahList[randomNumber].uuid}`}>
            <Button {...restProps}>{children || "Random Surah"}</Button>
        </Link>
    );
}
