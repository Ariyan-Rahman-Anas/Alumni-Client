import { ReactNode } from "react";

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