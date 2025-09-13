import { QuranPage } from "@/components/quran/QuranPage";
import { PageDivider } from "@/components/quran/PageDivider";
import { AyahBreakersResponse } from "@ntq/sdk";

interface QuranPagesProps {
    takhtitsAyahsBreakers: AyahBreakersResponse[];
    mushaf?: string;
    className?: string;
}

// Helper function to calculate pages and their ranges
function calculatePages(takhtitsAyahsBreakers: AyahBreakersResponse[]) {
    // Get unique page numbers and sort them
    const uniquePages = Array.from(
        new Set(takhtitsAyahsBreakers.map(ayah => ayah.page).filter(Boolean))
    ).sort((a, b) => (a || 0) - (b || 0));

    // Calculate ayah range for each page
    return uniquePages.map(pageNumber => {
        const pageAyahs = takhtitsAyahsBreakers.filter(ayah => ayah.page === pageNumber);
        const firstAyahIndex = takhtitsAyahsBreakers.findIndex(ayah => ayah.page === pageNumber);
        const lastAyahIndex = takhtitsAyahsBreakers.findLastIndex(ayah => ayah.page === pageNumber);
        
        return {
            pageNumber: pageNumber!,
            ayahCount: pageAyahs.length,
            offset: firstAyahIndex,
            limit: lastAyahIndex - firstAyahIndex + 1
        };
    });
}

export function QuranPages({ 
    takhtitsAyahsBreakers, 
    mushaf = "hafs", 
    className
}: QuranPagesProps) {
    // Calculate all pages and their ranges
    const allPages = calculatePages(takhtitsAyahsBreakers);

    return (
        <div className={className}>
            {allPages.map((page, index) => (
                <div key={page.pageNumber}>
                    {/* Add PageDivider for each page */}
                    <PageDivider pagenumber={page.pageNumber} />
                    
                    <QuranPage 
                        pageNumber={page.pageNumber}
                        ayahRange={{
                            offset: page.offset,
                            limit: page.limit
                        }}
                        mushaf={mushaf}
                    />
                    
                    {/* Add spacing between pages (except for the last page) */}
                    {index < allPages.length - 1 && (
                        <div style={{ marginBottom: '2rem' }} />
                    )}
                </div>
            ))}
        </div>
    );
}
