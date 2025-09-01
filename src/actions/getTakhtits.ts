"use server";

import { AyahBreakersResponse, Takhtit, takhtitsAyahsBreakersList, takhtitsList } from "@ntq/sdk";

export async function getTakhtits(): Promise<Takhtit[]> {
    const resp = await takhtitsList({params: {mushaf: "hafs"}});

    return resp.data ?? [];
}

export async function getTakhtitsAyahsBreakers(
    takhtit_uuid: string
): Promise<AyahBreakersResponse[]> {
    const resp = await takhtitsAyahsBreakersList({path: { uuid: takhtit_uuid }});

    return resp.data ?? [];
}