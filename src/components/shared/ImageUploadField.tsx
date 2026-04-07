"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <div
                className={cn(
                    "rounded-2xl border p-4 transition",
                    hasError ? "border-red-400 bg-red-50/30" : "bg-white/80"
                )}
                style={{
                    borderColor: hasError ? undefined : "rgba(46,139,87,0.18)",
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Preview */}
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className={cn(
                            "flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border transition hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary-200,#9DD8AE)]"
                        )}
                        style={{
                            borderColor: "var(--color-border)",
                            background: "rgba(46,139,87,0.06)",
                        }}
                        aria-label="Select profile image"
                    >
                        {previewSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={previewSrc}
                                alt="Selected preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <ImagePlus
                                className="size-8"
                                style={{ color: "var(--color-primary-400, #4DB472)", opacity: 0.6 }}
                            />
                        )}
                    </button>

                    {/* Info column */}
                    <div className="min-w-0 flex-1">
                        <p
                            className="truncate text-sm font-medium"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            {currentFile?.name ?? (previewUrl ? "Current image" : "No image selected")}
                        </p>
                        <p
                            className="mt-0.5 text-xs"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            {helperText}
                        </p>

                        <div className="mt-2.5 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                className="rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:opacity-80 focus:outline-none"
                                style={{
                                    borderColor: "var(--color-primary-300, #72C48C)",
                                    color: "var(--color-primary-700)",
                                    background: "rgba(46,139,87,0.07)",
                                }}
                            >
                                <ImagePlus className="mr-1.5 inline size-3" />
                                {currentFile || previewUrl ? "Change" : "Upload image"}
                            </button>

                            {(currentFile || previewUrl) && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-100 focus:outline-none"
                                >
                                    <X className="size-3" />
                                    Remove
                                </button>
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

            {displayError && <p className="text-xs text-red-500">{displayError}</p>}
        </div>
    );
};

export default ImageUploadField;
