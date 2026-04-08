"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DatePickerSinglePropsI } from "@/components/shared/types/form-fields.types";

const DatePickerSingle = ({
    value,
    onChange,
    label = "Date",
    placeholder = "Pick a date",
    required = false,
    error,
    helperText,
    id,
}: DatePickerSinglePropsI) => {
    const generatedId = useId();
    const pickerId = id ?? `date-picker-${generatedId}`;
    const [open, setOpen] = useState(false);
    const hasError = Boolean(error);

    const selectedDate = useMemo(() => {
        if (!value) return undefined;
        const parsed = parseISO(value);
        return isValid(parsed) ? parsed : undefined;
    }, [value]);

    const [visibleMonth, setVisibleMonth] = useState<Date>(selectedDate ?? new Date());

    useEffect(() => {
        if (open) {
            setVisibleMonth(selectedDate ?? new Date());
        }
    }, [open, selectedDate]);

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label
                    htmlFor={pickerId}
                    className="block text-xs"
                >
                    {label}
                    {required && <span className="ml-1 text-danger">*</span>}
                </label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        id={pickerId}
                        type="button"
                        className={cn(
                            "flex h-10 w-full items-center justify-start rounded-lg border bg-white px-4 text-left text-sm font-normal text-accent-foreground transition focus:outline-none focus-visible:border-primary2-500",
                            hasError
                                ? "border-danger focus-visible:border-danger"
                                : "",
                            !selectedDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 size-4 shrink-0 opacity-60" />
                        {selectedDate ? format(selectedDate, "PPP") : placeholder}
                    </button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0 overflow-hidden" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        month={visibleMonth}
                        onMonthChange={setVisibleMonth}
                        onSelect={(date) => {
                            onChange?.(date ? format(date, "yyyy-MM-dd") : "");
                            setOpen(false);
                        }}
                        captionLayout="dropdown"
                        initialFocus
                        startMonth={new Date(1930, 0)}
                        endMonth={new Date()}
                    />
                </PopoverContent>
            </Popover>

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

export default DatePickerSingle;