"use client";

import { ReactNode } from "react";
import { PreferencesProvider } from "@/contexts/preferencesContext";
import { StorageProvider } from "@/contexts/storageContext";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <StorageProvider>
            <PreferencesProvider>{children}</PreferencesProvider>
        </StorageProvider>
    );
}
