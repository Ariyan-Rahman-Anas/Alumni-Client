import type { Metadata } from "next";

export const metadata: Metadata = { title: "Batch Room" };

export default function BatchRoom() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
            <h1 className="text-2xl font-bold">Batch Room</h1>
            <p className="text-muted-foreground">This feature is coming soon.</p>
        </div>
    );
}
