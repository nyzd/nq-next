"use server";

import { AyahBreakersResponse, Takhtit, takhtitsAyahsBreakersList, takhtitsList } from "@ntq/sdk";

export async function getTakhtits(mushaf: "hafs" | string): Promise<Takhtit[]> {
    const response = await takhtitsList({ params: { mushaf: mushaf } });

    if (!response.data) throw new Error(`Error when getting takhtits list, status: ${response.status}, msg: ${response.data}`);

    return response.data;
}

export async function getTakhtitsAyahsBreakers(
    takhtit_uuid: string
): Promise<AyahBreakersResponse[]> {
    const response = await takhtitsAyahsBreakersList({ path: { uuid: takhtit_uuid } });

    if (!response.data) throw new Error(`Error when getting takhtits ayahs breakers list, status: ${response.status}, msg: ${response.data}`)

    return response.data;
}