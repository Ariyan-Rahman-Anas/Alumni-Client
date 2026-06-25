const AnnouncementCardSkeleton = () => {
    return (
        <div className="animate-pulse rounded-2xl border border-surface-200 bg-white overflow-hidden">
            <div className="h-1 w-full bg-surface-200" />
            <div className="p-5 space-y-3">
                <div className="flex gap-1.5">
                    <div className="h-5 w-16 rounded-full bg-surface-200" />
                    <div className="h-5 w-12 rounded-full bg-surface-200" />
                </div>
                <div className="h-4 w-5/6 rounded bg-surface-200" />
                <div className="h-4 w-3/4 rounded bg-surface-200" />
                <div className="h-3 w-full rounded bg-surface-200" />
                <div className="h-3 w-4/5 rounded bg-surface-200" />
                <div className="h-px w-full bg-surface-100 mt-2" />
                <div className="flex justify-between">
                    <div className="h-3 w-24 rounded bg-surface-200" />
                    <div className="h-3 w-10 rounded bg-surface-200" />
                </div>
            </div>
        </div>
    )
}
export default AnnouncementCardSkeleton