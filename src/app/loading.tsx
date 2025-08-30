import { Screen, Loading as YakadLoading } from "@yakad/ui";

export default function Loading() {
    return (
        <Screen align="center">
            <YakadLoading size="extraLarge" variant="dots" />
        </Screen>
    );
}
