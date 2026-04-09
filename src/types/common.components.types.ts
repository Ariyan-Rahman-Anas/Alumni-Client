import { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export interface PrimaryButtonI {
  type: "button" | "submit";
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
  isDisabled?: boolean;
  isLoading?: boolean;
  isFullWidth?: boolean;
  isNewTab?: boolean;
  className?: string;
  style?: React.CSSProperties;
  iconSide?: "left" | "right";
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