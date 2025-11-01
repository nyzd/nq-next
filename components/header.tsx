"use client";
import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MushafSettingsButton } from "./buttons/MushafSettingsButton";

export function Header() {
    return (
        <header className="sticky top-0 flex items-center justify-between  px-4 py-4 border-b bg-background/65 backdrop-blur supports-backdrop-filter:bg-background/65">
            <Button variant="ghost" size="icon" aria-label="Go back">
                <ArrowLeft className="h-6 w-6" />
            </Button>

            <h1 className="text-xl font-semibold text-white">Natiq</h1>

            <MushafSettingsButton />
        </header>
    );
}
