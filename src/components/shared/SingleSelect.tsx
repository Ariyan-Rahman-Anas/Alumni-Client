"use client";

import { useId, useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SingleSelectPropsI } from "@/types/common.components.types";

const SingleSelect = ({
    options = [],
    value,
    defaultValue = "",
    onValueChange,
    open,
    onOpenChange,
    placeholder = "Select an option...",
    searchPlaceholder = "Search...",
    emptyText = "No option found",
    disabled = false,
    searchable = true,
    label = "",
    width = "w-full",
    className = "",
    contentClassName = "",
    containerClassName = "",
    error = false,
    helperText,
    required = false,
    isRequiredSign = true,
    allowDeselect = false,
    name,
    id,
    isLoading = false,
}: SingleSelectPropsI) => {
    const generatedId = useId();
    const selectId = id ?? `single-select-${generatedId}`;
    const [internalOpen, setInternalOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue);

    const isControlled = value !== undefined;
    const isOpenControlled = open !== undefined;
    const selectedValue = isControlled ? value ?? "" : internalValue;
    const resolvedOpen = isOpenControlled ? Boolean(open) : internalOpen;

    const selectedOption = useMemo(
        () => options.find((option) => option.value === selectedValue),
        [options, selectedValue]
    );

    const handleChange = (nextValue: string) => {
        if (!isControlled) {
            setInternalValue(nextValue);
        }

        onValueChange?.(nextValue);
    };

    const handleSelect = (nextValue: string) => {
        const resolvedValue = allowDeselect && nextValue === selectedValue ? "" : nextValue;
        handleChange(resolvedValue);
        if (!isOpenControlled) {
            setInternalOpen(false);
        }
        onOpenChange?.(false);
    };

    const hasError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : "";

    const handleOpenChange = (nextOpen: boolean) => {
        if (!isOpenControlled) {
            setInternalOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
    };

    return (
        <div className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
            {label && (
                <label
                    htmlFor={selectId}
                    className={`block text-xs ${hasError ? "text-danger" : "text-primary2-800 dark:text-gunmetal-300"}`}
                // className="block text-xs"
                >
                    {label}
                    {required && isRequiredSign && (
                        <span className="text-danger">*</span>
                    )}
                </label>
            )}

            {name && <input type="hidden" name={name} value={selectedValue} />}

            {isLoading ? (
                <div
                    className={cn(
                        width,
                        "flex h-10 items-center rounded-lg border border-border bg-white dark:bg-gunmetal-600 px-4",
                        className
                    )}
                >
                    <div className="h-3 w-2/3 animate-pulse rounded-md bg-muted" />
                </div>
            ) : (
                <Popover open={resolvedOpen} onOpenChange={handleOpenChange}>
                    <PopoverTrigger asChild>
                        <button
                            id={selectId}
                            type="button"
                            role="combobox"
                            aria-controls={`${selectId}-listbox`}
                            aria-expanded={resolvedOpen}
                            aria-haspopup="listbox"
                            disabled={disabled}
                            className={cn(
                                width,
                                "flex h-10 items-center justify-between rounded-lg border bg-white text-primary2-600 dark:bg-gunmetal-600 dark:text-gunmetal-300 px-4 text-sm font-normal transition",
                                "focus:outline-none focus-visible:border-primary2-500",
                                hasError
                                    ? "border-danger focus-visible:border-danger"
                                    : "",
                                disabled && "cursor-not-allowed opacity-50",
                                !selectedOption && "text-muted-foreground",
                                className
                            )}
                        >
                            <span className="truncate text-left">
                                {selectedOption ? selectedOption.label : placeholder}
                            </span>
                            <ChevronDown
                                className={cn(
                                    "ml-2 size-4 shrink-0 opacity-50 transition-transform duration-200",
                                    resolvedOpen && "rotate-180"
                                )}
                            />
                        </button>
                    </PopoverTrigger>

                    <PopoverContent
                        align="start"
                        className={cn("w-[var(--radix-popover-trigger-width)] bg-white dark:bg-gunmetal-600 min-w-56 p-0", contentClassName)}
                        data-lenis-prevent
                    >
                        <Command>
                            {searchable && (
                                <CommandInput placeholder={searchPlaceholder} className="h-9 text-primary2-600 dark:text-gunmetal-300" />
                            )}

                            <CommandList
                                data-lenis-prevent
                                onWheel={(e) => e.stopPropagation()}
                            >
                                <CommandEmpty className="text-gunmetal-300 dark:text-gunmetal-200 text-center py-4" >{emptyText}</CommandEmpty>

                                <CommandGroup>
                                    {options.map((option) => {
                                        const isSelected = selectedValue === option.value;
                                        return (
                                            <CommandItem
                                                key={option.value}
                                                value={`${option.label} ${option.searchText ?? ""}`.trim()}
                                                onSelect={() => {
                                                    if (option.isDisabled) {
                                                        return;
                                                    }

                                                    handleSelect(option.value);
                                                }}
                                                disabled={option.isDisabled}
                                                className={cn(
                                                    "gap-3 rounded-md mb-0.5 px-3 py-2",
                                                    option.isDisabled && "cursor-not-allowed opacity-50", isSelected ? "bg-primary2-500 dark:bg-gunmetal-500" : "hover:bg-primary2-100 dark:hover:bg-gunmetal-400",
                                                )}
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className={isSelected ? "text-white dark:text-gunmetal-300" : "text-primary2-600 dark:text-gunmetal-300"}>{option.label}</p>
                                                    {option.description && (
                                                        <p className={`mt-0.5 text-xs ${isSelected ? "text-white dark:text-gunmetal-200" : "text-gunmetal-300"}`}>
                                                            {option.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <Check
                                                    className={cn(
                                                        "size-4 shrink-0 text-white dark:text-gunmetal-200 transition-opacity",
                                                        isSelected ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            )}

            {errorMessage ? (
                <p className="text-xs text-danger">{errorMessage}</p>
            ) : helperText ? (
                <p className="text-xs text-muted-foreground">
                    {helperText}
                </p>
            ) : null}
        </div>
    );
};
export default SingleSelect;