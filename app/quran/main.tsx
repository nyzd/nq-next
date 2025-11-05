import Mushaf from "@/components/quran/Mushaf";
import { Suspense } from "react";

export default function Main() {
    return (
        <main className="p-10 flex flex-col items-center justify-center gap-2">
            <Suspense fallback="Loading mushaf">
                <Mushaf name="hafs" />
            </Suspense>
        </main>
    );
}
