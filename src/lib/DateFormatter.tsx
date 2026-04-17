const DateFormatter = ({ date, isShowTime = false }: { date: string | null | undefined, isShowTime?: boolean }) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
    if (isShowTime) {
        options.hour = "2-digit";
        options.minute = "2-digit";
    }
    return (
        <span>{
            date ? new Date(date).toLocaleDateString(undefined, options): "N/A"
        }</span>
    )
}
export default DateFormatter