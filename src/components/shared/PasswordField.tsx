"use client";

import { useId, useState } from "react";
import { RiEyeLine, RiEyeOffLine, RiLock2Line } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { PasswordFieldPropsI } from "@/types/common.components.types";

const PasswordField = ({
    value,
    onChange,
    onBlur,
    label = "Password",
    placeholder = "Enter password",
    required = false,
    error,
    helperText,
    id,
    name,
}: PasswordFieldPropsI) => {
    const generatedId = useId();
    const inputId = id ?? `password-field-${generatedId}`;
    const [showPassword, setShowPassword] = useState(false);
    const hasError = Boolean(error);

    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={inputId}
                className={`block text-xs ${hasError ? "text-danger" : "text-primary2-800 dark:text-gunmetal-300"}`}>
                {label}
                {required && <span className="text-danger">*</span>}
            </label>

            <div className="relative">
                <RiLock2Line
                    className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg ${hasError ? "text-danger" : "text-primary2-500 dark:text-gunmetal-300"}`}
                />

                <input
                    id={inputId}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    value={value ?? ""}
                    onChange={(event) => onChange?.(event.target.value)}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={cn(
                        "h-10 w-full rounded-lg border bg-white dark:bg-gunmetal-600 pl-10 pr-10 text-sm outline-none transition",
                        hasError
                            ? "border-danger focus:border-danger text-danger"
                            : "focus:border-primary2-500 dark:focus:border-gunmetal-300 text-primary2-500 dark:text-gunmetal-300"
                    )}
                />

                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg ${hasError ? "text-danger" : "text-primary2-500 dark:text-gunmetal-300"}`}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
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
};

export default PasswordField;
