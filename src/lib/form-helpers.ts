import type { FieldErrors, FieldValues, Path } from "react-hook-form";
import { toast } from "sonner";

const getErrorMessage = (error: unknown): string | undefined => {
    if (!error || typeof error !== "object") return undefined;

    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === "string" && maybeMessage.length > 0) {
        return maybeMessage;
    }

    return undefined;
};

export const findFirstError = <T extends FieldValues>(
    errors: FieldErrors<T>,
    fieldOrder?: Path<T>[]
): { field?: Path<T>; message?: string } => {
    if (fieldOrder && fieldOrder.length > 0) {
        for (const field of fieldOrder) {
            const message = getErrorMessage(errors[field]);
            if (message) {
                return { field, message };
            }
        }
    }

    const firstKey = Object.keys(errors)[0] as Path<T> | undefined;
    if (!firstKey) {
        return {};
    }

    return {
        field: firstKey,
        message: getErrorMessage(errors[firstKey]),
    };
};

export const showFirstFormError = <T extends FieldValues>(
    errors: FieldErrors<T>,
    fieldOrder?: Path<T>[]
): { field?: Path<T>; message?: string } => {
    const first = findFirstError(errors, fieldOrder);
    if (first.message) {
        toast.error(first.message);
    }
    return first;
};
