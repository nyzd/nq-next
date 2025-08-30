import { StorageProvider } from "@/contexts/storageContext";
import ThemeWrapper from "./ThemeWrapper";
import { Audio } from "@/components";

export const runtime = "edge";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <StorageProvider>
                    <ThemeWrapper>{children}</ThemeWrapper>
                    <Audio />
                </StorageProvider>
            </body>
        </html>
    );
}
