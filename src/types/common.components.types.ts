import { InputHTMLAttributes, ReactNode } from "react";

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
}


export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ReactNode;
    iconRight?: ReactNode;
    error?: string;
    helperText?: string;
    containerClassName?: string;
}
