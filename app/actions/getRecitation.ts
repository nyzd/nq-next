"use server";

import { PaginatedRecitationListList, recitationsList } from "@ntq/sdk";

export async function getRecitations(
    mushaf: "hafs",
    limit: number,
    offset: number = 1,
): Promise<PaginatedRecitationListList> {
    const response = await recitationsList({query: { mushaf: mushaf, limit: limit, offset: offset}});

    if (!response.data) throw Error("Error when Getting recitations list");

    return response.data;
}