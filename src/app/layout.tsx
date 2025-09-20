import { client } from "@ntq/sdk";
import { Audio } from "@/components";
import ThemeWrapper from "./ThemeWrapper";
import Providers from "./Providers";

export const runtime = "edge";

client.setConfig({
    baseURL: process.env.API_URL || "https://api.natiq.net",
});

export const metadata = {
    title: "Natiq Quran",
    description: "Natiq Quran",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <ThemeWrapper>{children}</ThemeWrapper>
                    <Audio />
                </Providers>
            </body>
        </html>
    );
}
