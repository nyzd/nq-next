import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex items-center justify-center p-10">
            <Button asChild>
                <Link href="/quran">Go to Quran page!</Link>
            </Button>
        </div>
    );
}
