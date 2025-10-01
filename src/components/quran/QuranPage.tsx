import { TranslationList} from "@ntq/sdk";
import { AyahRange } from "./AyahRange";
import { Card, Text } from "@yakad/ui";

interface AyahRange {
    offset: number;
    limit: number;
}

interface QuranPageProps {
    index: number;
    mushaf?: string;
    page: {
        pageNumber: number;
        ayahCount: number;
        offset: number;
        limit: number;
    };
    className?: string;
    translation?: TranslationList;
    onLoad?: () => void;
}

export function QuranPage({ mushaf = "hafs", className, translation, page, onLoad}: QuranPageProps) { // If no ayahs found for this page, show a message
    if (!page) {
        return (
            <div className={className}>
                <div style={{ 
                    padding: '2rem', 
                    textAlign: 'center',
                    color: '#666'
                }}>
                    Page Not found!
                </div>
            </div>
        );
    }

    return (
        <Card align="center">
            <AyahRange 
                offset={page?.offset ?? 0}
                limit={page?.limit ?? 0}
                mushaf={mushaf}
                translation={translation}
                onLoad={onLoad}
            />

            <Text>{page.pageNumber}</Text>
        </Card>
    );
}
