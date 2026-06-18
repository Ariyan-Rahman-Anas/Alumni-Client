import { RiLoginBoxLine, RiRefreshLine } from "react-icons/ri";
import PrimaryButton from "./PrimaryButton";
import { Bug } from "lucide-react";
import { LayoutErrorBoundaryProps } from "@/types/common.components.types";

const LayoutErrorBoundary = ({ title, message, btn1Text, btn1Icon, btn2Text, btn2Link, btn2Icon, error, reset }: LayoutErrorBoundaryProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="flex justify-center mb-5">
          <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white border-2 border-danger text-danger text-3xl">
            <Bug />
          </span>
        </div>

        <h2 className="text-xl font-bold text-primary2-500 dark:text-gunmetal-200 mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {`${message}. Please try again.`}
          {error?.digest && (
            <span className="block mt-1 text-xs font-mono text-neutral-400">
              ID: {error.digest}
            </span>
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <PrimaryButton
            onClick={reset}
            title={btn1Text || "Try again"}
            icon={btn1Icon || <RiRefreshLine />}
          />
          <PrimaryButton
            href={btn2Link || "/login"}
            title={btn2Text || "Back to login"}
            icon={btn2Icon || <RiLoginBoxLine />}
            className="bg-white dark:bg-gunmetal-600 text-primary2-700 dark:text-gunmetal-200  border border-primary2-700 dark:border-gunmetal-400"
          />
        </div>
      </div>
    </div>
  )
}
export default LayoutErrorBoundary