import { IGoBackwardProps } from "@/types/common.components.types"
import { RiArrowLeftLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { FadeUpWrapper } from "../pages/user/Home/HomePage";

const GoBackward = ({ text }: IGoBackwardProps) => {
    const router = useRouter();
  return (
      <FadeUpWrapper
          delay={0.7}
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary2-600 hover:text-primary2-900 dark:text-gunmetal-200 transition-colors mb-10 group cursor-pointer select-none"
      >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-primary2-200 dark:border-gunmetal-200 bg-primary2-50 group-hover:bg-primary2-100 dark:bg-gunmetal-500 dark:group-hover:bg-gunmetal-200 transition-colors duration-300">
              <RiArrowLeftLine className="text-sm dark:text-gunmetal-200 dark:group-hover:text-gunmetal-800" />
          </span>
          {`Back to ${text}`}
      </FadeUpWrapper>
  )
}
export default GoBackward