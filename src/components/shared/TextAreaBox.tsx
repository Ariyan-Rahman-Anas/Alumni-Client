import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { RiMapPin2Line } from "react-icons/ri";
import { cn } from "@/lib/utils";

interface TextAreaBoxProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    containerClassName?: string;
}

const TextAreaBox = forwardRef<HTMLTextAreaElement, TextAreaBoxProps>(
    (
        {
            label,
            id,
            name,
            error,
            helperText,
            required,
            rows = 4,
            className,
            containerClassName,
            ...props
        },
        ref
    ) => {
        const areaId = id || name;
        const hasError = Boolean(error);

        return (
            <div className={cn("flex flex-col gap-1.5", containerClassName)}>
                {label && (
                    <label
                        htmlFor={areaId}
                        className="block text-xs"
                    >
                        {label}
                        {required && <span className="ml-1 text-danger">*</span>}
                    </label>
                )}

                <div className="relative">
                    <RiMapPin2Line
                        className={`pointer-events-none absolute left-3 top-3 text-lg ${hasError ? "text-danger" : "text-primary2-500"}`}
                    />
                    <textarea
                        ref={ref}
                        id={areaId}
                        name={name}
                        rows={rows}
                        className={cn(
                            "min-h-28 w-full rounded-lg border bg-white pl-10 pr-4 py-3 text-sm text-accent-foreground outline-none transition",
                            hasError
                                ? "border-danger focus:border-danger"
                                : "focus:border-primary2-500",
                            className
                        )}
                        {...props}
                    />
                </div>

                {error ? (
                    <p className="text-xs text-red-500">{error}</p>
                ) : helperText ? (
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {helperText}
                    </p>
                ) : null}
            </div>
        );
    }
);

TextAreaBox.displayName = "TextAreaBox";

export default TextAreaBox;
