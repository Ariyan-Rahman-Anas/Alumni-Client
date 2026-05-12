import { FieldValues, Path, UseFormProps, useForm } from "react-hook-form";
import { toast } from "sonner";

import { findFirstError } from "@/lib/form-helpers";

interface UseFormWithToastOptions<T extends FieldValues> {
    fieldOrder?: Path<T>[];
}

/**
 * Wraps react-hook-form's `useForm` with automatic first-error toasting on
 * invalid submission. Overrides `handleSubmit` to inject an `onInvalid`
 * handler — more reliable than watching formState via useEffect.
 */
export const useFormWithToast = <T extends FieldValues>(
    props: UseFormProps<T>,
    options?: UseFormWithToastOptions<T>
) => {
    const form = useForm<T>(props);
    const fieldOrder = options?.fieldOrder;

    const handleSubmit: typeof form.handleSubmit = (onValid, onInvalid) => {
        return form.handleSubmit(onValid, (errors, event) => {
            console.log("[useFormWithToast] onInvalid called, errors:", errors);
            const first = findFirstError<T>(errors, fieldOrder);
            console.log("[useFormWithToast] first error:", first);
            if (first.message) {
                toast.error(first.message);
            }
            onInvalid?.(errors, event);
        });
    };

    return { ...form, handleSubmit };
};
