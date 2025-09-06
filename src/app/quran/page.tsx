import { getTakhtits, getTakhtitsAyahsBreakers } from "@/actions/getTakhtits";
import { QuranPageClient } from "@/components/quran/QuranPageClient";

export default async function Page() {
    try {
        // Fetch takhtits data on the server
        const firstTakhtit = await getTakhtits();
        const firstTakhtitUuid = firstTakhtit[0].uuid;
        const takhtitsAyahsBreakers = await getTakhtitsAyahsBreakers(firstTakhtitUuid);
        
        return <QuranPageClient takhtitsAyahsBreakers={takhtitsAyahsBreakers} />;
    } catch (error) {
        console.error("Error fetching takhtits:", error);
        return <QuranPageClient takhtitsAyahsBreakers={[]} />;
    }
}
