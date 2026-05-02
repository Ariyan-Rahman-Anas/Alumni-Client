"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import PrimaryButton from "./PrimaryButton";

const ACCEPTED_MIME = ["image/jpeg", "image/png", "image/webp"] as const;
type AcceptedMime = (typeof ACCEPTED_MIME)[number];

export interface ImageUploadFieldProps {
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
    accept?: AcceptedMime[];
    required?: boolean;
    id?: string;
    containerClassName?: string;
}

const ImageUploadField = ({
    value,
    onChange,
    previewUrl,
    label = "Profile Image",
    helperText = "JPG, PNG or WEBP — square or portrait photo works best.",
    error,
    maxSizeMB = 5,
    accept = [...ACCEPTED_MIME],
    required = false,
    id,
    containerClassName,
}: ImageUploadFieldProps) => {
    const generatedId = useId();
    const inputId = id ?? `image-upload-${generatedId}`;
    const inputRef = useRef<HTMLInputElement>(null);
    const objectUrlRef = useRef<string>("");

    // Uncontrolled internal state
    const [internalFile, setInternalFile] = useState<File | null>(null);
    const [internalPreview, setInternalPreview] = useState<string>("");
    const [localError, setLocalError] = useState<string>("");

    const isControlled = value !== undefined;
    const currentFile = isControlled ? value : internalFile;

    // Controlled mode: create/revoke object URL when value (File) changes
    useEffect(() => {
        if (!isControlled) return;
        if (value) {
            const url = URL.createObjectURL(value);
            setInternalPreview(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setInternalPreview("");
        }
    }, [value, isControlled]);

    // Derived preview: controlled callers pass previewUrl when editing existing records
    const previewSrc = currentFile
        ? internalPreview || previewUrl || ""
        : (previewUrl ?? "");

    const hasError = Boolean(error || localError);
    const displayError = error || localError;

    // Revoke object URL on unmount / file change
    useEffect(() => {
        return () => {
            if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        };
    }, []);

    const updateUncontrolledPreview = (file: File) => {
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        const url = URL.createObjectURL(file);
        objectUrlRef.current = url;
        setInternalPreview(url);
    };

    const clearUncontrolledPreview = () => {
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = "";
        setInternalPreview("");
    };

    const handleFile = (file: File | null) => {
        setLocalError("");

        if (!file) {
            if (!isControlled) {
                setInternalFile(null);
                clearUncontrolledPreview();
            }
            onChange?.(null);
            return;
        }

        // Validate MIME type
        if (!(accept as string[]).includes(file.type)) {
            setLocalError(
                `Unsupported file type. Allowed: ${accept
                    .map((t) => t.split("/")[1].toUpperCase())
                    .join(", ")}`
            );
            return;
        }

        // Validate size
        if (file.size > maxSizeMB * 1024 * 1024) {
            setLocalError(`File must be smaller than ${maxSizeMB} MB`);
            return;
        }

        if (!isControlled) {
            setInternalFile(file);
            updateUncontrolledPreview(file);
        }
        onChange?.(file);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFile(event.target.files?.[0] ?? null);
    };

    const handleClear = () => {
        if (inputRef.current) inputRef.current.value = "";
        handleFile(null);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0] ?? null;
        handleFile(file);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    return (
        <div className={cn("flex flex-col gap-1.5", containerClassName)}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-xs"
                >
                    {label}
                    {required && <span className="text-danger">*</span>}
                </label>
            )}

            <div
                className={cn(
                    "rounded-2xl border p-4 transition",
                    hasError ? "border-danger bg-red-50/30" : "bg-white dark:bg-gunmetal-600 dark:border-gunmetal-400 ",
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Preview */}
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className={cn(
                            "flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border dark:border-gunmetal-500 transition hover:bg-primary2-50 focus:outline-none"
                        )}
                        aria-label="Select profile image"
                    >
                        {previewSrc ? (
                            <Image
                                src={previewSrc}
                                alt="Selected preview"
                                className="h-full w-full object-cover"
                                width={500}
                                height={500}
                            />
                        ) : (
                            <ImagePlus
                                className="size-8 text-primary2-300 dark:text-gunmetal-300 opacity-60"
                            />
                        )}
                    </button>

                    {/* Info column */}
                    <div className="min-w-0 flex-1">
                        <p
                            className="truncate text-sm font-medium"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            {currentFile?.name ?? (previewUrl ? "Current image" : "")}
                        </p>
                        {!currentFile && <p
                            className="mt-0.5 text-xs text-gunmetal-300 ">
                            {helperText}
                        </p>}

                        <div className="mt-2.5 flex flex-wrap gap-2">
                            <PrimaryButton
                                type="button"
                                variant="outline"
                                onClick={() => inputRef.current?.click()}
                                title={currentFile || previewUrl ? "Change" : "Upload image"}
                                className="py-3"
                                icon={<ImagePlus className="size-3" />}
                            />

                            {(currentFile || previewUrl) && (
                                <PrimaryButton
                                    type="button"
                                    variant="destructive"
                                    onClick={handleClear}
                                    title="Remove"
                                    className="py-3"
                                    icon={<X className="size-3" />}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden file input */}
            <input
                ref={inputRef}
                id={inputId}
                type="file"
                accept={accept.join(",")}
                className="hidden"
                onChange={handleInputChange}
            />

            {displayError && <p className="text-xs text-danger">{displayError}</p>}
        </div>
    );
};

export default ImageUploadField;
