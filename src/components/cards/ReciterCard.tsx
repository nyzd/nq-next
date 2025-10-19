import Image from "next/image";
import { Button, Card, CardProps, Text } from "@yakad/ui";
import { Symbol } from "@yakad/symbols";

interface ReciterCardProps extends Omit<CardProps, "children"> {
    imagesrc: string;
    recitername: string;
}

export function ReciterCard({
    imagesrc,
    recitername,
    style,
    ...restProps
}: ReciterCardProps) {
    return (
        <Card
            title={recitername}
            style={{ padding: 0, ...style }}
            {...restProps}
        >
            <div
                style={{
                    position: "relative",
                }}
            >
                <Image
                    src={imagesrc}
                    alt={recitername}
                    width={190}
                    height={190}
                />
                <Button
                    title="Test sound"
                    variant="text"
                    icon={<Symbol icon="volume_up" />}
                    style={{
                        position: "absolute",
                        top: "0.8rem",
                        right: "0.8rem",
                    }}
                />
            </div>
            <Text variant="body4" style={{ padding: "2rem" }}>
                {recitername}
            </Text>
        </Card>
    );
}
