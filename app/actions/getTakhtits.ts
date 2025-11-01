"use server";

import { AyahBreakersResponse, Takhtit, takhtitsAyahsBreakersList, takhtitsList } from "@ntq/sdk";

export async function getTakhtits(mushaf: "hafs" | string): Promise<Takhtit[]> {
    const resp = await takhtitsList({ params: { mushaf: mushaf } });

    if (!resp.data) throw new Error("Error when getting takhtits list");

    return resp.data;
}

export async function getTakhtitsAyahsBreakers(
    takhtit_uuid: string
): Promise<AyahBreakersResponse[]> {
    const resp = await takhtitsAyahsBreakersList({ path: { uuid: takhtit_uuid } });

    if (!resp.data) throw new Error("Error when getting takhtits ayahs breakers list")

    return resp.data;
}