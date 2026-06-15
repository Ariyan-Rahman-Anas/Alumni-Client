import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import SectionLabel from "@/components/shared/SectionLabel";
import { RiGroupLine } from "react-icons/ri";
import { useGetActiveCommitteeQuery } from "@/redux/apis/committeeApi";
import { format } from "date-fns";
import AboutPageAlumniCommitteeSkeleton from "./AboutPageAlumniCommitteeSkeleton";
import AlumniCommitteeCard from "./AlumniCommitteeCard";

const AboutPageAlumniCommittee = () => {
    const { data, isLoading, isError } = useGetActiveCommitteeQuery();
    const committee = data?.data;

    const period = committee
        ? `${format(new Date(committee.functionalFrom), "MMM yyyy")} — ${committee.functionalTo ? format(new Date(committee.functionalTo), "MMM yyyy") : "Present"}`
        : null;

    return (
        <div className="three-xl-section-setup">
            {/* ── Static heading — always visible ──────────── */}
            <FadeUpWrapper className="text-center mb-14">
                <SectionLabel text="Alumni Committee" icon={<RiGroupLine />} className="dark:text-gunmetal-300 dark:border-gunmetal-500" />
                <h2 className="section-heading-text-center mb-3 mt-5 text-primary2-900 dark:text-gunmetal-200">
                    The People{" "}
                    <span className="text-primary">Behind It</span>
                </h2>
                {/* Dynamic subtitle — skeleton until loaded */}
                {committee && (
                    <p className="dark:text-gunmetal-300">
                        {committee.description
                            ? committee.description
                            : "Volunteers from different batches keeping the BAMHSian spirit alive."}
                    </p>
                )}
                {period && (
                    <p className="text-xs text-muted-foreground mt-1">{committee?.name} · {period}</p>
                )}
            </FadeUpWrapper>

            {/* ── Skeleton (description + cards) ───────────── */}
            {isLoading && <AboutPageAlumniCommitteeSkeleton />}

            {/* ── Error ────────────────────────────────────── */}
            {isError && (
                <p className="text-center text-sm text-muted-foreground py-10">
                    Could not load committee information.
                </p>
            )}

            {/* ── Members grid ─────────────────────────────── */}
            {!isLoading && !isError && committee && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {committee.members.map((item, i) => (
                        <FadeUpWrapper key={i} delay={i * 0.07}>
                            <AlumniCommitteeCard {...item} />
                        </FadeUpWrapper>
                    ))}
                </div>
            )}
        </div>
    );
}
export default AboutPageAlumniCommittee