import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import SectionLabel from "@/components/shared/SectionLabel";
import { RiGroupLine, RiLoaderLine } from "react-icons/ri";
import { useGetActiveCommitteeQuery } from "@/redux/apis/committeeApi";
import type { ICommitteeMemberUser } from "@/types/common/committee.types";
import { format } from "date-fns";

const AboutPageAlumniCommittee = () => {
    const { data, isLoading, isError } = useGetActiveCommitteeQuery();
    const committee = data?.data;

    const period = committee
        ? `${format(new Date(committee.functionalFrom), "MMM yyyy")} — ${committee.functionalTo ? format(new Date(committee.functionalTo), "MMM yyyy") : "Present"}`
        : null;

    return (
        <div className="three-xl-section-setup">
            <FadeUpWrapper className="text-center mb-14">
                <SectionLabel text="Alumni Committee" icon={<RiGroupLine />} className="dark:text-gunmetal-300 dark:border-gunmetal-500" />
                <h2
                    className="section-heading-text-center mb-3 mt-5 text-primary2-900 dark:text-gunmetal-200 ">
                    The People{" "}
                    <span className="text-primary">Behind It</span>
                </h2>
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

            {isLoading && (
                <div className="flex justify-center items-center py-16 text-muted-foreground gap-2">
                    <RiLoaderLine className="animate-spin" size={20} />
                    <span className="text-sm">Loading committee...</span>
                </div>
            )}

            {isError && (
                <p className="text-center text-sm text-muted-foreground py-10">
                    Could not load committee information.
                </p>
            )}

            {!isLoading && !isError && committee && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {committee.members.map(({ member, designation }, i) => {
                        const user = typeof member === "object" ? (member as ICommitteeMemberUser) : null;
                        const name = user?.name ?? "Member";
                        const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
                        return (
                            <FadeUpWrapper key={i} delay={i * 0.07}>
                                <div className="flex items-center gap-4 p-5 rounded-2xl border shadow hover:-translate-y-1 transition-all duration-300">
                                    {/* Avatar */}
                                    {user?.imageUrl ? (
                                        <img
                                            src={user.imageUrl}
                                            alt={name}
                                            className="w-12 h-12 rounded-full object-cover shrink-0"
                                        />
                                    ) : (
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg shrink-0"
                                            style={{
                                                background: "linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200))",
                                                color: "var(--color-primary-700)",
                                            }}
                                        >
                                            {initials}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>
                                            {name}
                                        </p>
                                        <p className="text-xs dark:text-gunmetal-300">{designation}</p>
                                        {user?.batch && (
                                            <span className="text-[10px] tracking-wider mt-1 block" style={{ color: "var(--color-primary-500)" }}>
                                                Batch {user.batch}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </FadeUpWrapper>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
export default AboutPageAlumniCommittee