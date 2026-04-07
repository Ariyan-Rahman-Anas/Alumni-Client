export interface DatePickerSinglePropsI {
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    helperText?: string;
    id?: string;
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
