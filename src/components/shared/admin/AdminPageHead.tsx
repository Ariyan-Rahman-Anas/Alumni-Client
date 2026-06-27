import { AdminPageHeadProps } from "@/types/common.components.types"

const AdminPageHead = ({ title, description }: AdminPageHeadProps) => {
  return (
      <section className="sticky top-0 border-b border-b-surface-200 dark:border-b-surface-700 px-4 py-2 bg-white dark:bg-[#041a12]">
          <h1 className="text-xl font-semibold text-black dark:text-gunmetal-200">{title}</h1>
          <p className="text-sm text-muted-foreground">
              {description}
          </p>
      </section>
  )
}
export default AdminPageHead