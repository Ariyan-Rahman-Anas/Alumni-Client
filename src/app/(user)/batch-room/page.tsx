import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const wm = await getWebsiteData();
    const shortName = wm?.schoolName ? toShortName(wm.schoolName) : "BAMHS";
    return {
        title: "Batch Room",
        description: `Connect with your ${shortName} batchmates in the alumni batch room.`,
    };
}

export default function BatchRoom() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
            <h1 className="text-2xl font-bold">Batch Room</h1>
            <p className="text-muted-foreground">This feature is coming soon.</p>
        </div>
    );
}
