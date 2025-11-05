import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MushafSettingsButton } from "./buttons/MushafSettingsButton";
import { getTranslations } from "@/app/actions/getTranslations";

export async function Header() {
    "use cache";
    const translations = await getTranslations("hafs", 200, 0);
    return (
        <header className="z-50 sticky top-0 flex items-center justify-between  px-4 py-4 border-b bg-background/65 backdrop-blur supports-backdrop-filter:bg-background/65">
            <Button variant="ghost" size="icon" aria-label="Go back">
                <ArrowLeft className="h-6 w-6" />
            </Button>

            <h1 className="text-xl font-semibold text-white">Natiq</h1>

            <MushafSettingsButton translations={translations} />
        </header>
    );
}
