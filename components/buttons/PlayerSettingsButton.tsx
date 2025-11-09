"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function PlayerSettingsButton() {
    const [selectedReciter, setSelectedReciter] = useState("");
    const [autoScroll, setAutoScroll] = useState(false);
    const [recitationsLoading, setRecitationsLoading] = useState(false);

    const recitations = [
        { reciter_account_uuid: "Reciter 1 - Murattal" },
        { reciter_account_uuid: "Reciter 2 - Mujawwad" },
        { reciter_account_uuid: "Reciter 3 - Murattal" },
    ];

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[400px] flex pl-52 pr-52">
                <SheetHeader>
                    <SheetTitle>Settings</SheetTitle>
                </SheetHeader>
                <div className="p-4 space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Recite</h3>
                        {recitations.length <= 0 && !recitationsLoading ? (
                            <p className="text-sm text-muted-foreground">
                                No recitation Found!
                            </p>
                        ) : !recitationsLoading ? (
                            <Select
                                value={selectedReciter}
                                onValueChange={setSelectedReciter}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Reciter - Reciting type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {recitations.map((recitation, index) => (
                                        <SelectItem
                                            key={index}
                                            value={
                                                recitation.reciter_account_uuid
                                            }
                                        >
                                            {recitation.reciter_account_uuid}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className="flex items-center justify-center py-4">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Auto scroll</h3>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="autoScroll"
                                checked={autoScroll}
                                onCheckedChange={(checked) =>
                                    setAutoScroll(checked as boolean)
                                }
                            />
                            <Label
                                htmlFor="autoScroll"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Auto scroll
                            </Label>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
