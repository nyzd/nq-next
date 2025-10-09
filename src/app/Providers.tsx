"use client";

import { ReactNode } from "react";
import { PreferencesProvider } from "@/contexts/preferencesContext";
import { OptionsProvider } from "@/contexts/optionsContext";
import { SelectedProvider } from "@/contexts/selectedsContext";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <OptionsProvider>
            <SelectedProvider>
                <PreferencesProvider>{children}</PreferencesProvider>
            </SelectedProvider>
        </OptionsProvider>
    );
}
