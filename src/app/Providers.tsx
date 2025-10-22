"use client";

import { ReactNode } from "react";
import { PreferencesProvider } from "@/contexts/preferencesContext";
import { PlayOptionsProvider } from "@/contexts/playOptionsContext";
import { SelectedProvider } from "@/contexts/selectedsContext";
import { MushafOptionsProvider } from "@/contexts/mushafOptionsContext";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <MushafOptionsProvider>
            <PlayOptionsProvider>
                <SelectedProvider>
                    <PreferencesProvider>{children}</PreferencesProvider>
                </SelectedProvider>
            </PlayOptionsProvider>
        </MushafOptionsProvider>
    );
}
