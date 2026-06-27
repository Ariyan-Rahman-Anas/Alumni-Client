import { StatCardProps } from "@/types/common.components.types"

const StatCard = ({ label, value, icon, color, isLoading }: StatCardProps) => {
    return (
        <div className="bg-white dark:bg-gunmetal-800 rounded-2xl border border-gray-100 dark:border-gunmetal-700 shadow-sm p-5 flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
                {isLoading ? (
                    <div className="h-7 w-16 bg-gray-100 dark:bg-gunmetal-700 rounded animate-pulse mt-1" />
                ) : (
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value ?? 0}</p>
                )}
            </div>
        </div>
    )
}
export default StatCard