import { LangCodeType, langName } from "@yakad/lib";
import { Card, CardProps, Text } from "@yakad/ui";

interface TranslationCardProps extends Omit<CardProps, "children"> {
    translatorname: string;
    langCode: LangCodeType;
}

export function TranslateionCard({
    translatorname,
    langCode,
    style,
    ...restProps
}: TranslationCardProps) {
    return (
        <Card
            title={translatorname}
            align="center"
            style={{
                width: "19rem",
                minHeight: "19rem",
                ...style,
            }}
            {...restProps}
        >
            <Text variant="heading3">{translatorname}</Text>
            <Text>{langName(langCode)}</Text>
        </Card>
    );
}
