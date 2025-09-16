import { TranslationList } from "@ntq/sdk";
import { AyahRange } from "./AyahRange";

interface AyahRange {
    offset: number;
    limit: number;
}

interface QuranPageProps {
    pageNumber: number;
    ayahRange: AyahRange | null;
    mushaf?: string;
    className?: string;
    translation?: TranslationList;
}

export function QuranPage({ pageNumber, ayahRange, mushaf = "hafs", className, translation }: QuranPageProps) { // If no ayahs found for this page, show a message
    if (!ayahRange) {
        return (
            <div className={className}>
                <div style={{ 
                    padding: '2rem', 
                    textAlign: 'center',
                    color: '#666'
                }}>
                    No ayahs found for page {pageNumber}
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <AyahRange 
                offset={ayahRange.offset}
                limit={ayahRange.limit}
                mushaf={mushaf}
                translation={translation}
            />
        </div>
    );
}
