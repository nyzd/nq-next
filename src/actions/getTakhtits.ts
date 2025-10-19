"use server";

import { AyahBreakersResponse, Takhtit, takhtitsAyahsBreakersList, takhtitsList } from "@ntq/sdk";

export async function getTakhtits(mushaf: "hafs" | string): Promise<Takhtit[]> {
    const resp = await takhtitsList({params: {mushaf:mushaf}});

    return resp.data ?? [];
}

export async function getTakhtitsAyahsBreakers(
    takhtit_uuid: string
): Promise<AyahBreakersResponse[]> {
    const resp = await takhtitsAyahsBreakersList({path: { uuid: takhtit_uuid }});

    return resp.data ?? [];
}