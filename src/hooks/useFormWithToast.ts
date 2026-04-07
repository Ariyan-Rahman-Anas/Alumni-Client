import { useEffect, useRef } from "react";
import { FieldValues, Path, UseFormProps, useForm } from "react-hook-form";
import { toast } from "sonner";

import { findFirstError } from "@/lib/form-helpers";

interface UseFormWithToastOptions<T extends FieldValues> {
    fieldOrder?: Path<T>[];
}

/**
 * Wraps react-hook-form's `useForm` with automatic first-error toasting.
 *
 * Toast fires once per submit attempt (tracks submitCount).
 * Highlighted field logic is intentionally left to the consumer so it stays
 * fresh during render — compute it with `findFirstErrorField()` in the form.
 */
export const useFormWithToast = <T extends FieldValues>(
    props: UseFormProps<T>,
    options?: UseFormWithToastOptions<T>
) => {
    const form = useForm<T>(props);
    const lastSubmitCountRef = useRef(0);
    const fieldOrder = options?.fieldOrder;

    useEffect(() => {
        const { errors, submitCount } = form.formState;

        // Only fire on new failed submits
        if (submitCount === 0 || submitCount <= lastSubmitCountRef.current) return;
        if (Object.keys(errors).length === 0) return;

        lastSubmitCountRef.current = submitCount;

        const first = findFirstError<T>(errors, fieldOrder);
        if (first.message) {
            toast.error(first.message);
        }
    // form.formState intentionally omitted — we only want to re-run on submitCount/errors changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.formState.submitCount, form.formState.errors, fieldOrder]);

    return form;
};
