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
                    className="block text-xs"
                >
                    {label}
                    {required && isRequiredSign && (
                        <span className="ml-1 text-danger">*</span>
                    )}
                </label>
            )}

            {name && <input type="hidden" name={name} value={selectedValue} />}

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
                            "flex h-10 items-center justify-between rounded-lg border bg-white px-4 text-sm font-normal text-accent-foreground transition",
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
                    className={cn("w-[var(--radix-popover-trigger-width)] min-w-56 p-0", contentClassName)}
                >
                    <Command>
                        {searchable && (
                            <CommandInput placeholder={searchPlaceholder} className="h-9" />
                        )}

                        <CommandList>
                            <CommandEmpty>{emptyText}</CommandEmpty>

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
                                                "gap-3 rounded-md px-3 py-2",
                                                option.isDisabled && "cursor-not-allowed opacity-50"
                                            )}
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate">{option.label}</p>
                                                {option.description && (
                                                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                        {option.description}
                                                    </p>
                                                )}
                                            </div>

                                            <Check
                                                className={cn(
                                                    "size-4 shrink-0 text-primary transition-opacity",
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

            {errorMessage ? (
                <p className="text-xs text-red-500">{errorMessage}</p>
            ) : helperText ? (
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {helperText}
                </p>
            ) : null}
        </div>
    );
};
export default SingleSelect;