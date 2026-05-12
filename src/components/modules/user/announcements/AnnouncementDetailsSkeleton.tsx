const AnnouncementDetailsSkeleton = () => {
    return (
        <div className="animate-pulse space-y-6">
            <div className="h-4 w-32 rounded-full bg-surface-200" />
            <div className="space-y-3">
                <div className="flex gap-2">
                    <div className="h-6 w-20 rounded-full bg-surface-200" />
                    <div className="h-6 w-16 rounded-full bg-surface-200" />
                </div>
                <div className="h-10 w-3/4 rounded-lg bg-surface-200" />
                <div className="h-5 w-1/2 rounded-lg bg-surface-200" />
                <div className="flex gap-4 mt-2">
                    <div className="h-4 w-28 rounded bg-surface-200" />
                    <div className="h-4 w-20 rounded bg-surface-200" />
                </div>
            </div>
            <div className="h-72 w-full rounded-2xl bg-surface-200" />
            <div className="space-y-2">
                <div className="h-4 w-full rounded bg-surface-200" />
                <div className="h-4 w-5/6 rounded bg-surface-200" />
                <div className="h-4 w-4/5 rounded bg-surface-200" />
            </div>
        </div>
    )
}
export default AnnouncementDetailsSkeleton