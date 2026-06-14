const MemberCardSkeleton = () => (
    <div className="flex items-center gap-4 p-5 rounded-2xl border shadow">
        <div className="skeleton w-12 h-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="skeleton h-3.5 w-2/3 rounded" />
            <div className="skeleton h-3 w-1/2 rounded opacity-80" />
            <div className="skeleton h-2.5 w-1/3 rounded opacity-60" />
        </div>
    </div>
);

/* Only the dynamic parts: description, period, and member cards */
const AboutPageAlumniCommitteeSkeleton = () => (
    <div>
        {/* Description + period placeholder */}
        <div className="flex flex-col items-center gap-2 mb-14">
            <div className="skeleton h-4 w-80 rounded opacity-80" />
            <div className="skeleton h-3 w-48 rounded opacity-60" />
        </div>

        {/* Member cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <MemberCardSkeleton key={i} />
            ))}
        </div>
    </div>
);

export default AboutPageAlumniCommitteeSkeleton;
