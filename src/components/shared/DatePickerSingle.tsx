"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { Clock } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DatePickerSinglePropsI } from "@/types/common.components.types";

const DatePickerSingle = ({
    value,
    onChange,
    label = "Date",
    placeholder = "Pick a date",
    required = false,
    error,
    helperText,
    id,
    includeTime = false,
    minDate,
    maxDate,
}: DatePickerSinglePropsI) => {
    const generatedId = useId();
    const pickerId = id ?? `date-picker-${generatedId}`;
    const [open, setOpen] = useState(false);
    const hasError = Boolean(error);

    // Parse date + time from value string
    // date-only:  "2024-03-15"
    // with time:  "2024-03-15T14:30"
    const { selectedDate, timeValue } = useMemo(() => {
        if (!value) return { selectedDate: undefined, timeValue: "00:00" };
        const [datePart, timePart] = value.split("T");
        const parsed = parseISO(datePart);
        return {
            selectedDate: isValid(parsed) ? parsed : undefined,
            timeValue: timePart?.substring(0, 5) ?? "00:00",
        };
    }, [value]);

    // Keep local time state so user can type time before date is chosen
    const [localTime, setLocalTime] = useState(timeValue);
    useEffect(() => {
        setLocalTime(timeValue);
    }, [timeValue]);

    const [visibleMonth, setVisibleMonth] = useState<Date>(selectedDate ?? new Date());
    useEffect(() => {
        if (open) setVisibleMonth(selectedDate ?? new Date());
    }, [open, selectedDate]);

    const handleDateSelect = (date: Date | undefined) => {
        if (!date) {
            onChange?.("");
            if (!includeTime) setOpen(false);
            return;
        }
        const datePart = format(date, "yyyy-MM-dd");
        if (includeTime) {
            onChange?.(`${datePart}T${localTime}`);
            // keep popover open so user can also set time
        } else {
            onChange?.(datePart);
            setOpen(false);
        }
    };

    const handleTimeChange = (newTime: string) => {
        setLocalTime(newTime);
        if (selectedDate) {
            const datePart = format(selectedDate, "yyyy-MM-dd");
            onChange?.(`${datePart}T${newTime}`);
        }
    };

    const displayText = useMemo(() => {
        if (!selectedDate) return null;
        if (includeTime) return `${format(selectedDate, "dd MMM yyyy")}, ${localTime}`;
        return format(selectedDate, "PPP");
    }, [selectedDate, localTime, includeTime]);

    // endMonth: use maxDate if provided, or +5 years when includeTime (future events), or today for dob etc.
    const endMonth = maxDate ?? (includeTime ? new Date(new Date().getFullYear() + 5, 11) : new Date());
    const startMonth = minDate ?? new Date(1930, 0);

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={pickerId}
                    className={`block text-xs ${hasError ? "text-danger" : "text-primary2-800 dark:text-gunmetal-300"}`}>
                    {label}
                    {required && <span className="text-danger">*</span>}
                </label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        id={pickerId}
                        type="button"
                        className={cn(
                            "flex h-10 w-full items-center justify-start rounded-lg border bg-white dark:bg-gunmetal-600 px-4 text-left text-sm font-normal text-primary2-600 dark:text-gunmetal-300 transition focus:outline-none focus-visible:border-primary2-500",
                            hasError ? "border-danger focus-visible:border-danger" : "",
                            !displayText && "text-muted-foreground"
                        )}
                    >
                        {displayText ?? placeholder}
                    </button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0 overflow-hidden" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        month={visibleMonth}
                        onMonthChange={setVisibleMonth}
                        onSelect={handleDateSelect}
                        captionLayout="dropdown"
                        initialFocus
                        startMonth={startMonth}
                        endMonth={endMonth}
                        // classNames="bg-white dark:bg-gunmetal-600"
                    />
                    {includeTime && (
                        <div className="border-t border-border px-3 py-2.5 flex items-center gap-2 bg-white dark:bg-gunmetal-600">
                            <Clock className="size-4 text-muted-foreground shrink-0" />
                            <span className="text-xs text-muted-foreground">Time</span>
                            <input
                                type="time"
                                value={localTime}
                                onChange={(e) => handleTimeChange(e.target.value)}
                                className="ml-auto h-8 rounded-md border border-input bg-white dark:bg-gunmetal-600 text-primary2-600 dark:text-gunmetal-300 px-2 text-sm outline-none focus:border-primary2-500 transition"
                            />
                        </div>
                    )}
                </PopoverContent>
            </Popover>

            {error ? (
                <p className="text-xs text-danger">{error}</p>
            ) : helperText ? (
                <p className="text-xs text-muted-foreground">{helperText}</p>
            ) : null}
        </div>
    );
};
export default DatePickerSingle;
