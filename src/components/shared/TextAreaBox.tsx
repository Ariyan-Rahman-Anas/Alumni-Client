import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { TextAreaBoxProps } from "@/types/common.components.types";


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
            className, icon,
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
                    {icon && (
                        <div className={cn(
                            "pointer-events-none absolute left-3 top-3 text-lg",
                            hasError ? "text-danger" : "text-primary2-500"
                        )}>
                            {icon}
                        </div>
                    )}
                    <textarea
                        ref={ref}
                        id={areaId}
                        name={name}
                        rows={rows}
                        className={cn(
                            "min-h-28 w-full rounded-lg border bg-white pr-4 py-3 text-sm text-accent-foreground outline-none transition",
                            icon ? "pl-10" : "px-4",
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
                    <p className="text-xs text-muted-foreground">
                        {helperText}
                    </p>
                ) : null}
            </div>
        );
    }
);

TextAreaBox.displayName = "TextAreaBox";

export default TextAreaBox;
