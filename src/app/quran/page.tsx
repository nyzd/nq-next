import { getTakhtits, getTakhtitsAyahsBreakers } from "@/actions/getTakhtits";
import { QuranPageWrapper } from "./QuranPageWrapper";
import { getTranslations } from "@/actions/getTranslations";

export default async function Page() {
    try {
        // Fetch takhtits data on the server
        const firstTakhtit = await getTakhtits();
        const firstTakhtitUuid = firstTakhtit[0].uuid;
        const takhtitsAyahsBreakers = await getTakhtitsAyahsBreakers(firstTakhtitUuid);

        const translations = await getTranslations("hafs", 1);
        
        return <QuranPageWrapper translation={translations[0]} takhtitsAyahsBreakers={takhtitsAyahsBreakers} />;
    } catch (error) {
        console.error("Error fetching takhtits:", error);
        return <QuranPageWrapper takhtitsAyahsBreakers={[]} />;
    }
}
