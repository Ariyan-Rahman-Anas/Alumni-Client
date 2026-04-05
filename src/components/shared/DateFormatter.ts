export const DateFormatter = ({ date }: { date: string | Date | null | undefined }) => {
    if (!date) return "—";
    return date ? new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "N/A";
}