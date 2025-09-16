import { LazyQuranPage, PageDivider } from "@/components";
import { AyahBreakersResponse, TranslationList } from "@ntq/sdk";
import { useEffect, useRef } from "react";
import { useStorage } from "@/contexts/storageContext";

interface QuranPagesProps {
    takhtitsAyahsBreakers: AyahBreakersResponse[];
    mushaf?: string;
    className?: string;
    translation?: TranslationList;
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
    className,
    translation
}: QuranPagesProps) {
    // Calculate all pages and their ranges
    const allPages = calculatePages(takhtitsAyahsBreakers);

    // Refs to each page wrapper for scrolling
    const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const { storage } = useStorage();

    // When a selected ayah changes but it's not rendered yet, scroll to its page wrapper
    useEffect(() => {
        const selectedUuid = storage.selected.ayahUUID;
        if (!selectedUuid) return;

        const ayahMeta = takhtitsAyahsBreakers.find(a => a.uuid === selectedUuid);
        const pageNumber = ayahMeta?.page;
        if (!pageNumber) return;

        const pageEl = pageRefs.current[pageNumber];
        if (pageEl) {
            pageEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [storage.selected.ayahUUID, takhtitsAyahsBreakers]);

    return (
        <div className={className}>
            {/* First Page is not in the takhtits so we have to hard code it */}
            <div
                ref={(el) => {
                    pageRefs.current[1] = el;
                }}
                id={`quran-page-1`}
            >
                <LazyQuranPage 
                    pageNumber={1}
                    ayahRange={{
                        offset: 0,
                        limit: 7
                    }}
                    mushaf={mushaf}
                    translation={translation}
                />
            </div>

            {allPages.map((page, index) => (
                <div key={page.pageNumber} ref={(el) => {
                    pageRefs.current[page.pageNumber] = el;
                }} id={`quran-page-${page.pageNumber}`}>
                    {/* Add PageDivider for each page */}
                    <PageDivider pagenumber={page.pageNumber} />
                    
                    <LazyQuranPage 
                        pageNumber={page.pageNumber}
                        ayahRange={{
                            offset: page.offset,
                            limit: page.limit
                        }}
                        mushaf={mushaf}
                        translation={translation}
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
