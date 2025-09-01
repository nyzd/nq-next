import { StorageProvider } from "@/contexts/storageContext";
import ThemeWrapper from "./ThemeWrapper";
import { Audio } from "@/components";
import { client } from "@ntq/sdk";

export const runtime = "edge";

client.setConfig({
    baseURL: process.env.API_URL || "https://api.natiq.net"
})

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
