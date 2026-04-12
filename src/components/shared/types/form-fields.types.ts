export interface DatePickerSinglePropsI {
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    helperText?: string;
    id?: string;
    /** When true, shows a time picker below the calendar and emits "yyyy-MM-dd'T'HH:mm" */
    includeTime?: boolean;
    /** Disable dates before this date */
    minDate?: Date;
    /** Disable dates after this date (default: today for date-only, +5 years for includeTime) */
    maxDate?: Date;
}

export interface PasswordFieldPropsI {
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    helperText?: string;
    id?: string;
    name?: string;
}
