import { constantsData } from "@/constants";
import { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export interface PrimaryButtonI {
  type?: "button" | "submit";
  title?: string;
  loadingTitle?: string;
  onClick?: (e: React.MouseEvent) => void;
  href?: string | any;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
  icon?: ReactNode;
  icon2?: ReactNode;
  isDisabled?: boolean;
  isLoading?: boolean;
  isFullWidth?: boolean;
  isNewTab?: boolean;
  className?: string;
  style?: React.CSSProperties;
  iconSide?: "left";
  iconSide2?: "right";
}

export interface SingleSelectOptionI {
  label: string;
  value: string;
  description?: string;
  searchText?: string;
  isDisabled?: boolean;
}

export interface SingleSelectPropsI {
  options?: SingleSelectOptionI[];
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  searchable?: boolean;
  label?: string;
  width?: string;
  className?: string;
  contentClassName?: string;
  containerClassName?: string;
  error?: string | boolean;
  helperText?: string;
  required?: boolean;
  isRequiredSign?: boolean;
  allowDeselect?: boolean;
  name?: string;
  id?: string;
  isLoading?: boolean;
}


export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ReactNode;
    iconRight?: ReactNode;
  error?: string;
  isShowErrorMessage?: boolean;
    helperText?: string;
    containerClassName?: string;
}

export interface TextAreaBoxProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
  containerClassName?: string;
  icon?: ReactNode;
}

export interface UserMenuProps {
    /** Size of the avatar button */
    size?: "sm" | "md";
    align?: "start" | "center" | "end";
}

export interface DeleteAlertModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  title?: string;
  description?: string;
}


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

export interface AdminPageHeadProps {
    title: string;
    description?: string;
}

export interface StatCardProps {
    label: string;
    value: number | undefined;
    icon: React.ReactNode;
    color: string;
    isLoading: boolean;
}

type TAcceptedMime = (typeof constantsData.ACCEPTED_MIME)[number];
export interface IImageUploadFieldProps {
    /** Controlled: current File (null = cleared) */
    value?: File | null;
    /** Called when the user picks / clears a file */
    onChange?: (file: File | null) => void;
    /** Existing image URL (e.g. server-side preview on edit forms) */
    previewUrl?: string;
    label?: string;
    helperText?: string;
    /** External field-level error (e.g. from react-hook-form) */
    error?: string;
    /** Max allowed file size in MB (default 5) */
    maxSizeMB?: number;
    /** Accepted MIME types (default: jpg/png/webp) */
    accept?: TAcceptedMime[];
    required?: boolean;
    id?: string;
    containerClassName?: string;
}