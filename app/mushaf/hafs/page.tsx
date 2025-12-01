import { Header } from "@/components/header";
import { Player } from "@/components/player";
import Main from "./main";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function FallbackSkeleton() {
    return <Skeleton className="w-full h-16 rounded-none" />;
}

export default async function QuranPage() {
    return (
        <>
            <Suspense fallback={<FallbackSkeleton />}>
                <Header />
            </Suspense>
            <Main mushaf={"hafs"} />
            <Suspense fallback={<FallbackSkeleton />}>
                <Player mushaf={"hafs"} />
            </Suspense>
        </>
    );
}
