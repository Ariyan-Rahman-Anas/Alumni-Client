import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import Image from "next/image"
import { RiBookOpenLine, RiBriefcaseLine, RiCheckboxCircleLine, RiHeartLine, RiMapPinLine, RiMoneyDollarCircleLine, RiToolsLine } from "react-icons/ri"
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { IJobPost, TJobPostType } from "./job.types";

const JobPageJobCard = ({ job, index }: { job: IJobPost; index: number }) => {

    const TYPE_CONFIG: Record<TJobPostType, { label: string; color: string; icon: React.ReactNode }> = {
        OFFICIAL: {
            label: "Official Job",
            color: "bg-blue-50 text-blue-700 border border-blue-200",
            icon: <RiBriefcaseLine />,
        },
        TUITION: {
            label: "Tuition Seek",
            color: "bg-emerald-50 text-emerald-700 border border-emerald-200",
            icon: <RiBookOpenLine />,
        },
        PERSONAL: {
            label: "Service Seek",
            color: "bg-violet-50 text-violet-700 border border-violet-200",
            icon: <RiToolsLine />,
        },
    };

    const cfg = TYPE_CONFIG[job.type];
    const postedAgo = formatDistanceToNow(new Date(job.createdAt), { addSuffix: true });
    const router = useRouter()

    return (
        <FadeUpWrapper
            delay={index * 0.04}
            onClick={() => router.push(`/jobs/${job._id}`)}
            className="group relative bg-white rounded-2xl border border-surface-200 p-5 hover:shadow-md hover:border-primary2-300 cursor-pointer transition-all duration-300 flex flex-col"
        >
            {/* Type badge */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg?.color}`}>
                    {cfg?.icon} {cfg?.label}
                </span>
                <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{postedAgo}</span>
            </div>

            <h3 className="font-bold text-primary2-900 text-base leading-snug mb-1 group-hover:text-primary2-700 transition-colors line-clamp-2">
                {job.title}
            </h3>

            {/* Meta info by type */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                {job.type === "OFFICIAL" && job.company && (
                    <span className="flex items-center gap-1"><RiBriefcaseLine /> {job.company}</span>
                )}
                {job.type === "OFFICIAL" && job.location && (
                    <span className="flex items-center gap-1"><RiMapPinLine /> {job.location}</span>
                )}
                {job.type === "OFFICIAL" && (job.salaryMin || job.salaryMax) && (
                    <span className="flex items-center gap-1">
                        <RiMoneyDollarCircleLine />
                        {job.salaryNegotiable ? "Negotiable" : `${job.salaryMin ?? "?"} – ${job.salaryMax ?? "?"} ${job.salaryCurrency ?? "BDT"}`}
                    </span>
                )}
                {job.type === "TUITION" && job.studentClass && (
                    <span className="flex items-center gap-1"><RiBookOpenLine /> Class {job.studentClass}</span>
                )}
                {job.type === "TUITION" && job.subjects?.length && (
                    <span className="flex items-center gap-1"><RiCheckboxCircleLine /> {job.subjects.slice(0, 2).join(", ")}{job.subjects.length > 2 ? "…" : ""}</span>
                )}
                {job.type === "PERSONAL" && job.serviceCategory && (
                    <span className="flex items-center gap-1"><RiToolsLine /> {job.serviceCategory}</span>
                )}
                {(job.type === "TUITION" || job.type === "PERSONAL") && job.seekLocation && (
                    <span className="flex items-center gap-1"><RiMapPinLine /> {job.seekLocation}</span>
                )}
            </div>

            <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">{job.description}</p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-100">
                <div className="flex items-center gap-2">
                    {job.postedBy.imageUrl ? (
                        <Image src={job.postedBy.imageUrl} alt={job.postedBy.name} width={24} height={24} className="rounded-full object-cover" />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-primary2-100 flex items-center justify-center text-xs font-bold text-primary2-700">
                            {job.postedBy.name[0]}
                        </div>
                    )}
                    <span className="text-xs text-muted-foreground">{job.postedBy.name}</span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <RiHeartLine /> {job.likes.length}
                </span>
            </div>
        </FadeUpWrapper>
    )
}
export default JobPageJobCard