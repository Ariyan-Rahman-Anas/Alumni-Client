import Image from "next/image";
import type { ICommitteeMember, ICommitteeMemberUser } from "@/types/common/committee.types";

const AlumniCommitteeCard = ({ member, designation }: ICommitteeMember) => {
    const user = typeof member === "object" ? (member as ICommitteeMemberUser) : null;
    const name = user?.name ?? "Member";
    const initials = name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="flex items-center gap-4 p-5 rounded-2xl border shadow hover:-translate-y-1 transition-all duration-300">
            {user?.imageUrl ? (
                <Image
                    src={user.imageUrl}
                    alt={name}
                    width={800}
                    height={800}
                    className="w-16 h-16 rounded-full object-cover shrink-0"
                />
            ) : (
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center font-display font-bold text-lg shrink-0"
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
                <p className="text-xs capitalize text-gunmetal-400 dark:text-gunmetal-300 mt-1">
                    {designation.split("_").join(" ").toLowerCase()}
                </p>
                {user?.batch && (
                    <span className="text-xs tracking-wider mt-0.5 block text-gunmetal-400 dark:text-gunmetal-300">
                        Batch {user.batch}
                    </span>
                )}
            </div>
        </div>
    );
};

export default AlumniCommitteeCard;
