import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { InputFieldProps } from "@/types/common.components.types";

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    (
        {
            label,
            icon,
            iconRight,
            error,
            isShowErrorMessage = true,
            helperText,
            containerClassName,
            className,
            required,
            id,
            ...props 
        },
        ref
    ) => {
        const inputId = id || props.name;
        const hasError = Boolean(error);

        return (
            <div className={cn("flex flex-col gap-1.5", containerClassName)}>
                {/* Label */}
                {label && (
                    <label htmlFor={inputId} className={`block text-xs ${hasError ? "text-danger" : "text-primary2-800 dark:text-gunmetal-300"}`}>
                        {label}
                        {required && <span className="text-danger">*</span>}
                    </label>
                )}

                {/* Input wrapper */}
                <div className="relative">
                    {/* Left Icon */}
                    {icon && (
                        <span
                            className={cn(
                                "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg",
                                hasError ? "text-danger" : "text-primary2-500 dark:text-gunmetal-300"
                            )}
                        >
                            {icon}
                        </span>
                    )}

                    {/* Input */}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            "h-10 w-full rounded-lg border bg-white dark:bg-gunmetal-600 text-base md:text-sm outline-none transition",
                            icon ? "pl-10" : "px-4",
                            iconRight ? "pr-10" : "pr-4",
                            hasError
                                ? "border-danger focus:border-danger text-danger"
                                : "focus:border-primary2-500 dark:focus:border-gunmetal-300 text-primary2-600 dark:text-gunmetal-300",
                            className
                        )}
                        {...props}
                    />

                    {/* Right Icon */}
                    {iconRight && (
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lg">
                            {iconRight}
                        </span>
                    )}
                </div>

                {/* Error message */}
                {isShowErrorMessage && error && (
                    <p className="text-xs text-danger">{error}</p>
                )}

                {/* Helper text */}
                {!error && helperText && (
                    <p className="text-xs text-muted-foreground">{helperText}</p>
                )}
            </div>
        );
    }
);

InputField.displayName = "InputField";

export default InputField;