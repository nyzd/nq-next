"use client";

import { useEffect, useRef, useState } from "react";
import { QuranPage } from "./QuranPage";
import { LoadingIcon, P, Container } from "@yakad/ui";
import { TranslationList } from "@ntq/sdk";

interface AyahRange {
    offset: number;
    limit: number;
}

interface LazyQuranPageProps {
    pageNumber: number;
    ayahRange: AyahRange;
    mushaf?: string;
    className?: string;
    translation?: TranslationList;
}

export function LazyQuranPage({
    pageNumber,
    ayahRange,
    mushaf = "hafs",
    className,
    translation,
}: LazyQuranPageProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const pageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasLoaded) {
                        setIsVisible(true);
                        setHasLoaded(true);
                        // Disconnect observer after first load to prevent re-triggering
                        observer.disconnect();
                    }
                });
            },
            {
                // Load content when the page is 100px away from being visible
                rootMargin: "100px 0px",
                threshold: 0.1,
            }
        );

        if (pageRef.current) {
            observer.observe(pageRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [hasLoaded]);

    return (
        <div ref={pageRef} className={className}>
            {!isVisible ? (
                <Container
                    size="sm"
                    align="center"
                    style={{
                        minHeight: "400px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "2rem",
                    }}
                >
                    <LoadingIcon variant="dots" />
                    <P
                        variant="body2"
                        style={{ marginTop: "1rem", color: "#666" }}
                    >
                        Page {pageNumber} - Scroll to load content
                    </P>
                </Container>
            ) : (
                <QuranPage
                    pageNumber={pageNumber}
                    ayahRange={ayahRange}
                    mushaf={mushaf}
                    translation={translation}
                />
            )}
        </div>
    );
}
