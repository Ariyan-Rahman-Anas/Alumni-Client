import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { PrimaryButtonI } from "@/types/common.components.types";
import { cn } from "@/lib/utils";

const PrimaryButton = ({
    title,
    type = "button",
    href,
    icon,
    icon2,
    isNewTab = false,
    variant = "default",
    isDisabled = false,
    isFullWidth = false,
    onClick,
    isLoading = false,
    loadingTitle,
    className = "",
    iconSide = "left",
    iconSide2 = "right",
    style
}: PrimaryButtonI) => {
    const buttonContent = (
        <>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isLoading && iconSide === "left" && icon}
            {(title || (isLoading && loadingTitle)) && (
                <span>{isLoading ? loadingTitle || title : title}</span>
            )}
            {!isLoading && iconSide2 === "right" && icon2}
        </>
    );

    const buttonClassName =
        `rounded-md py-4 px-4 ${isFullWidth ? "w-full" : "min-w-24 md:min-w-28 "} ${!title && !loadingTitle ? "p-2" : ""} ${className}`.trim();
    const isButtonDisabled = isDisabled || isLoading;

    return href && !isLoading ? (
        <Link
            // href={!isDisabled && href}
            href={ href}
            target={isNewTab ? "_blank" : "_self"}
            rel={isNewTab ? "noopener noreferrer" : undefined}
            // className={isFullWidth ? "w-full block" : "inline-block" }
            className={cn(isFullWidth ? "w-full block" : "inline-block", isDisabled ? "pointer-events-none" : "")}
        >
            <Button
                type={type}
                variant={variant}
                disabled={isButtonDisabled}
                className={buttonClassName}
                style={style}
            >
                {buttonContent}
            </Button>
        </Link>
    ) : (
        <Button
            type={type}
            variant={variant}
            disabled={isButtonDisabled}
            className={buttonClassName}
            style={style}
            onClick={!isLoading ? onClick : undefined}
        >
            {buttonContent}
        </Button>
    );
};

export default PrimaryButton;