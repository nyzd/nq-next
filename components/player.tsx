import { PlayBackButton } from "./buttons/PlayBackButton";
import { RepeatButton } from "./buttons/RepeatButton";
import { PlayerSettingsButton } from "./buttons/PlayerSettingsButton";
import { PlayButton } from "./buttons/PlayButton";
import { Button } from "@/components/ui/button";
import { Symbol } from "@yakad/symbols";
import { getRecitations } from "@/app/actions/getRecitation";
import PlayerProgress from "./PlayerProgress";

export async function Player({ mushaf }: { mushaf: string }) {
    "use cache";
    const recitationsResponse = await getRecitations(mushaf as "hafs", 200, 0);
    const recitations = recitationsResponse ?? [];

    return (
        <footer className="sticky bottom-0 left-0 right-0 border-t bg-background/65 backdrop-blur supports-[backdrop-filter]:bg-background/65 z-50">
            <PlayerProgress />
            <div className="flex items-center gap-5 lg:gap-15 p-3.5 justify-center">
                <PlayerSettingsButton recitations={recitations} />
                <PlayBackButton />
                <PlayButton />
                <RepeatButton />

                <Button size="icon-lg" variant="ghost">
                    <Symbol icon="fullscreen" />
                </Button>
            </div>
        </footer>
    );
}
