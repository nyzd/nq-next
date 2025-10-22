import { Card, CardProps, Text } from "@yakad/ui";

interface SurahCardProps extends Omit<CardProps, "children"> {
    arabicname: string;
    englishname: string;
    surahnumber: number;
    ayahnumber: number;
    nickname?: string;
}

export function SurahCard({
    arabicname,
    englishname,
    surahnumber,
    ayahnumber,
    nickname,
    style,
    ...restProps
}: SurahCardProps) {
    return (
        <Card
            title={englishname}
            align="center"
            style={{
                width: "19rem",
                minHeight: "19rem",
                ...style,
            }}
            {...restProps}
        >
            <Text variant="heading3">{arabicname}</Text>
            <Text variant="heading5">{`${surahnumber}. ${englishname}`}</Text>
            <Text>{`Ayah ${ayahnumber}`}</Text>
            <Text>{nickname}</Text>
        </Card>
    );
}
