import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
    return (
        <div className="fixed top-0 left-0 flex justify-center w-full h-full items-center">
            <Spinner className="size-8" />
        </div>
    );
}
