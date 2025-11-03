import Mushaf from "@/components/quran/Mushaf";
import { Suspense } from "react";

export default function Main() {
    return (
        <main className="p-10 flex items-center justify-center">
            <Suspense fallback={<h1>Loading Mushaf</h1>}>
                <Mushaf name="hafs" />
            </Suspense>
        </main>
    );
}
