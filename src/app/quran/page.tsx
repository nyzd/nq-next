import { Main, Screen } from "@yakad/ui";
import Mushaf from "@/components/quran/mushaf/Mushaf";
import AppBarWrapper from "./AppBarWrapper";
import FooterWrapper from "./FooterWrapper";

export default function Page() {
    // const searchParams = useSearchParams();
    // const [_, setSelected] = useSelected();

    // // Handle URL parameter on component mount
    // useEffect(() => {
    //     const ayahUuid = searchParams.get("ayah_uuid");

    //     if (ayahUuid) {
    //         // Add a small delay to ensure localStorage has been loaded first
    //         setTimeout(() => {
    //             setSelected((prev) => ({
    //                 ...prev,
    //                 ayahUUID: ayahUuid,
    //             }));
    //         }, 50);
    //     }
    // }, [searchParams, setSelected]);

    return (
        <Screen>
            <AppBarWrapper />
            <Main>
                <Mushaf name="hafs" />
            </Main>
            <FooterWrapper />
        </Screen>
    );
}
