const EventDetailsSkeleton = () => {
    return (
        <div className="animate-pulse space-y-8">
            <div className="skeleton h-[55vh] min-h-[400px] rounded-[2.5rem]" />
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
                    <div className="space-y-4">
                        <div className="skeleton h-6 w-3/4 rounded" />
                        <div className="skeleton h-4 w-full rounded" />
                        <div className="skeleton h-4 w-2/3 rounded" />
                    </div>
                    <div className="skeleton h-80 rounded-3xl" />
                </div>
            </div>
        </div>
    )
}
export default EventDetailsSkeleton