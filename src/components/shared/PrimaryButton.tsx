import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { PrimaryButtonI } from "@/types/common.components.types";

const PrimaryButton = ({
    title,
    type = "button",
    href,
    icon,
    isNewTab = false,
    variant = "default",
    isDisabled = false,
    isFullWidth = false,
    onClick,
    isLoading = false,
    loadingTitle,
    className = "",
    iconSide = "left",
}: PrimaryButtonI) => {
    const buttonContent = (
        <>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isLoading && iconSide === "left" && icon}
            {(title || (isLoading && loadingTitle)) && (
                <span>{isLoading ? loadingTitle || title : title}</span>
            )}
            {!isLoading && iconSide === "right" && icon}
        </>
    );

    const buttonClassName =
        `rounded-md py-4 px-4 ${isFullWidth ? "w-full" : "min-w-24 md:min-w-28 "} ${!title && !loadingTitle ? "p-2" : ""} ${className}`.trim();
    const isButtonDisabled = isDisabled || isLoading;

    return href && !isLoading ? (
        <Link
            href={href}
            target={isNewTab ? "_blank" : "_self"}
            rel={isNewTab ? "noopener noreferrer" : undefined}
            className={isFullWidth ? "w-full block" : "inline-block"}
        >
            <Button
                type={type}
                variant={variant}
                disabled={isButtonDisabled}
                className={buttonClassName}
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
            onClick={!isLoading ? onClick : undefined}
        >
            {buttonContent}
        </Button>
    );
};

export default PrimaryButton;