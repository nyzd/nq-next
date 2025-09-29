import { TranslationList } from "@ntq/sdk";
import { AyahRange } from "./AyahRange";

interface AyahRange {
    offset: number;
    limit: number;
}

interface QuranPageProps {
    index: number;
    mushaf?: string;
    pages: {
        pageNumber: number;
        ayahCount: number;
        offset: number;
        limit: number;
    }[];
    className?: string;
    translation?: TranslationList;
}

export function QuranPage({ index, mushaf = "hafs", className, translation, pages}: QuranPageProps) { // If no ayahs found for this page, show a message
    if (!pages) {
        return (
            <div className={className}>
                <div style={{ 
                    padding: '2rem', 
                    textAlign: 'center',
                    color: '#666'
                }}>
                    No ayahs found for page {index}
                </div>
            </div>
        );
    }

    // Find Page from index
    const page = pages[index];

    return (
        <div className={className}>
            <AyahRange 
                offset={page?.offset ?? 0}
                limit={page?.limit ?? 0}
                mushaf={mushaf}
                translation={translation}
            />
        </div>
    );
}
