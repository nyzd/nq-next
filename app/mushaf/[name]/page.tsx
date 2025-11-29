import { Header } from "@/components/header";
import { Player } from "@/components/player";
import Main from "./main";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function FallbackSkeleton() {
    return <Skeleton className="w-full h-16 rounded-none" />;
}

export default async function QuranPage({
    params,
}: {
    params: Promise<{ name: string }>;
}) {
    const { name } = await params;

    return (
        <>
            <Suspense fallback={<FallbackSkeleton />}>
                <Header />
            </Suspense>
            <Main mushaf={name} />
            <Suspense fallback={<FallbackSkeleton />}>
                <Player mushaf={name} />
            </Suspense>
        </>
    );
}
