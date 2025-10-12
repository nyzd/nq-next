"use server";

import { PaginatedRecitationListList, recitationsList } from "@ntq/sdk";

export async function getRecitations(
    mushaf: "hafs",
    limit: number,
    offset: number = 1,
): Promise<PaginatedRecitationListList> {
    const resp = await recitationsList({query: { mushaf: mushaf, limit: limit, offset: offset}});

    return resp.data || [];
}