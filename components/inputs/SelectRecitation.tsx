"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RecitationList } from "@ntq/sdk";
import { useEffect, useEffectEvent, useMemo, useState } from "react";

type SelectRecitationProps = {
    recitations: RecitationList[];
    selectedReciter: string;
    onValueChange: (value: string) => void;
};

export function SelectRecitation({
    recitations,
    selectedReciter,
    onValueChange,
}: SelectRecitationProps) {
    const isEmpty = recitations.length <= 0;
    const recitationsByReciter = useMemo(() => {
        const map = new Map<string, RecitationList[]>();

        recitations.forEach((recitation) => {
            const reciterName =
                recitation.reciter?.name || "Reciter name not found!";
            const current = map.get(reciterName) ?? [];

            current.push(recitation);
            map.set(reciterName, current);
        });

        return map;
    }, [recitations]);

    const selectedRecitation = useMemo(
        () => recitations.find((r) => r.uuid === selectedReciter),
        [recitations, selectedReciter]
    );

    const [selectedReciterName, setSelectedReciterName] = useState(() => {
        if (selectedRecitation) {
            return selectedRecitation.reciter?.name;
        }

        if (recitations.length > 0) {
            return recitations[0].reciter?.name;
        }

        return "";
    });

    const updateSelectedReciterName = useEffectEvent((name: string) =>
        setSelectedReciterName(name)
    );

    useEffect(() => {
        if (selectedRecitation) {
            updateSelectedReciterName(
                selectedRecitation.reciter?.name || "Reciter name not found"
            );
        }
    }, [selectedRecitation]);

    const recitationsForSelectedReciter = useMemo(
        () =>
            selectedReciterName
                ? recitationsByReciter.get(selectedReciterName) ?? []
                : [],
        [selectedReciterName, recitationsByReciter]
    );

    const effectiveSelectedRecitationUUID = useMemo(() => {
        if (
            selectedRecitation &&
            selectedRecitation.reciter?.name === selectedReciterName
        ) {
            return selectedRecitation.uuid;
        }

        if (recitationsForSelectedReciter.length > 0) {
            return recitationsForSelectedReciter[0].uuid;
        }

        return selectedReciter;
    }, [
        selectedRecitation,
        selectedReciterName,
        recitationsForSelectedReciter,
        selectedReciter,
    ]);

    const handleReciterChange = (reciterName: string) => {
        setSelectedReciterName(reciterName);

        const list = recitationsByReciter.get(reciterName);
        if (!list || list.length === 0) return;

        onValueChange(list[0].uuid);
    };

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold">Recite</h3>
            {isEmpty ? (
                <p className="text-sm text-muted-foreground">
                    No recitation Found!
                </p>
            ) : (
                <div className="flex flex-row gap-3">
                    <Select
                        value={effectiveSelectedRecitationUUID}
                        onValueChange={onValueChange}
                        defaultValue={recitations[0].uuid}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Reciting type" />
                        </SelectTrigger>
                        <SelectContent>
                            {recitationsForSelectedReciter.map(
                                (recitation, index) => (
                                    <SelectItem
                                        key={index}
                                        value={recitation.uuid}
                                    >
                                        {recitation.uuid}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>

                    <Select
                        value={selectedReciterName}
                        onValueChange={handleReciterChange}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Reciter" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from(recitationsByReciter.keys()).map(
                                (reciterName) => (
                                    <SelectItem
                                        key={reciterName}
                                        value={reciterName}
                                    >
                                        {reciterName}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
}
