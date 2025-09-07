"use client";

import React, { useState } from "react";
import { SurahsListResponse } from "@ntq/sdk";
import { filterArrayBySearch } from "@yakad/lib";
import {
    InputField,
    Container,
    Row,
    Spacer,
    Button,
    H1,
} from "@yakad/ui";
import { Symbol } from "@yakad/symbols";
import { RelatedSurahs, SearchResult } from "./utils";

interface SearchPageClientProps {
    initialSurahList: SurahsListResponse;
}

export function SearchPageClient({ initialSurahList }: SearchPageClientProps) {
    const [filteredSurahList, setFilteredSurahList] = useState<SurahsListResponse>(initialSurahList);

    const filterBySearchInputOnChange = (searchValue: string) => {
        setFilteredSurahList(
            filterArrayBySearch(initialSurahList, searchValue, [
                "number",
                "names",
                "period",
                "arabic",
            ])
        );
    };

    return (
        <>
            <Container size="md">
                <Row>
                    <H1 variant="heading3">Search</H1>
                    <Spacer />
                    <Button icon={<Symbol icon="mic" />} />
                    <Button icon={<Symbol icon="camera" />} />
                </Row>
                <Row>
                    <InputField
                        boxsize="small"
                        placeholder="Search Surah by Name or Number"
                        onChange={(e) => {
                            filterBySearchInputOnChange(e.target.value);
                        }}
                    />
                    <Button
                        size="small"
                        variant="outlined"
                        icon={<Symbol icon="question_mark" />}
                    />
                </Row>
            </Container>
            <Container size="md" style={{ marginTop: "2rem" }}>
                <RelatedSurahs surahList={initialSurahList} />
                <SearchResult surahList={filteredSurahList} />
            </Container>
        </>
    );
}
