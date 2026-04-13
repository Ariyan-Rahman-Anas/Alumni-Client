const DateFormatter = ({ date }: { date: string | null | undefined }) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
    return (
        <span>{
            date ? new Date(date).toLocaleDateString(undefined, options) : "N/A"
        }</span>
    )
}
export default DateFormatter