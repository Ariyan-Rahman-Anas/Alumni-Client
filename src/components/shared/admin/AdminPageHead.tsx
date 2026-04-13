import { AdminPageHeadProps } from "@/types/common.components.types"

const AdminPageHead = ({ title, description }: AdminPageHeadProps) => {
  return (
      <section>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
              {description}
          </p>
      </section>
  )
}
export default AdminPageHead