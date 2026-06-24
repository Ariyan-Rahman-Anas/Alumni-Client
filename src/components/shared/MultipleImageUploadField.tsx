"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, X, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import PrimaryButton from "./PrimaryButton";

const ACCEPTED_MIME = ["image/jpeg", "image/png", "image/webp"] as const;
type AcceptedMime = (typeof ACCEPTED_MIME)[number];

export interface MultipleImageUploadFieldProps {
  onChange?: (files: File[]) => void;
  onInnerTitlesChange?: (titles: string[]) => void;
  label?: string;
  helperText?: string;
  error?: string;
  maxSizeMB?: number;
  maxFiles?: number;
  accept?: AcceptedMime[];
  required?: boolean;
  id?: string;
  containerClassName?: string;
}

type FileItem = {
  file: File;
  previewUrl: string;
  key: string;
};

const MultipleImageUploadField = ({
  onChange,
  onInnerTitlesChange,
  label = "Images",
  helperText = "JPG, PNG or WEBP — max 5MB each.",
  error,
  maxSizeMB = 5,
  maxFiles = 20,
  accept = [...ACCEPTED_MIME],
  required = false,
  id,
  containerClassName,
}: MultipleImageUploadFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? `multi-image-upload-${generatedId}`;
  const inputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<FileItem[]>([]);
  const [innerTitles, setInnerTitles] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  // Revoke all object URLs on unmount
  useEffect(() => {
    const currentItems = items;
    return () => {
      currentItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = (newFiles: File[]) => {
    setLocalError("");

    const errors: string[] = [];
    const valid: File[] = [];

    for (const file of newFiles) {
      if (!(accept as string[]).includes(file.type)) {
        errors.push(`"${file.name}": unsupported type`);
        continue;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        errors.push(`"${file.name}": exceeds ${maxSizeMB}MB`);
        continue;
      }
      valid.push(file);
    }

    const available = maxFiles - items.length;

    if (valid.length > available) {
      errors.push(`Max ${maxFiles} images — ${valid.length - available} file(s) skipped`);
    }

    const toAdd = valid.slice(0, available);
    if (toAdd.length === 0) {
      if (errors.length) setLocalError(errors.join(" | "));
      return;
    }

    const newItems: FileItem[] = toAdd.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      key: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
    }));

    const updatedItems = [...items, ...newItems];
    const updatedTitles = [...innerTitles, ...Array(toAdd.length).fill("")];

    setItems(updatedItems);
    setInnerTitles(updatedTitles);
    onChange?.(updatedItems.map((i) => i.file));
    onInnerTitlesChange?.(updatedTitles);

    if (errors.length) setLocalError(errors.join(" | "));
  };

  const removeFile = (key: string) => {
    const idx = items.findIndex((i) => i.key === key);
    if (idx === -1) return;

    URL.revokeObjectURL(items[idx]!.previewUrl);

    const updatedItems = items.filter((_, i) => i !== idx);
    const updatedTitles = innerTitles.filter((_, i) => i !== idx);

    setItems(updatedItems);
    setInnerTitles(updatedTitles);
    setLocalError("");
    onChange?.(updatedItems.map((i) => i.file));
    onInnerTitlesChange?.(updatedTitles);
  };

  const handleInnerTitleChange = (index: number, value: string) => {
    const updatedTitles = [...innerTitles];
    updatedTitles[index] = value;
    setInnerTitles(updatedTitles);
    onInnerTitlesChange?.(updatedTitles);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) addFiles(files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) addFiles(files);
  };

  const hasError = Boolean(error || localError);
  const displayError = error || localError;
  const count = items.length;
  const showInnerTitles = count > 1;

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="block text-xs">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div
        className={cn(
          "rounded-2xl border-2 border-dashed p-4 transition-colors duration-300",
          isDragging
            ? "border-primary2-500 bg-primary2-50"
            : hasError
              ? "border-red-400 bg-red-50/30"
              : "border-gunmetal-100 dark:border-gunmetal-400 bg-white dark:bg-gunmetal-500/30 hover:border-primary2-300 dark:hover:border-gunmetal-300"
        )}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        {/* Empty state */}
        {items.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-6">
            <UploadCloud
              className="size-10 text-primary2-500 dark:text-gunmetal-200"/>
            <p className="text-sm font-medium text-gunmetal-300">
              Drag &amp; drop images here, or
            </p>
            <PrimaryButton
              title="   Browse files"
              icon={<ImagePlus className="size-4" />}
              onClick={() => inputRef.current?.click()}
            />
            <p className="text-xs text-gunmetal-300">{helperText}</p>
          </div>
        )}

        {/* Preview grid */}
        {items.length > 0 && (
          <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {items.map((item, index) => (
              <div key={item.key} className="flex flex-col gap-1">
                {/* Thumbnail */}
                <div className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(item.key)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100 focus:outline-none"
                    aria-label={`Remove ${item.file.name}`}
                  >
                    <X className="size-3" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 truncate bg-black/40 px-1 py-0.5 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
                    {item.file.name}
                  </div>
                </div>

                {/* Inner title input — only when multiple images */}
                {showInnerTitles && (
                  <input
                    type="text"
                    value={innerTitles[index] ?? ""}
                    onChange={(e) => handleInnerTitleChange(index, e.target.value)}
                    placeholder="Image title…"
                    maxLength={100}
                    className="w-full rounded-lg border border-gray-200 px-2 py-1 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-green-300 focus:outline-none focus:ring-0 transition"
                  />
                )}
              </div>
            ))}

            {/* Add more slot */}
            {count < maxFiles && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={cn(
                  "flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400 transition hover:border-green-300 hover:text-green-500 focus:outline-none",
                  showInnerTitles ? "aspect-square self-start" : "aspect-square"
                )}
                aria-label="Add more images"
              >
                <ImagePlus className="size-6" />
              </button>
            )}
          </div>
        )}

        {/* Bottom bar when files selected */}
        {items.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <p className="text-xs text-gray-500">
              {count} image{count !== 1 ? "s" : ""} selected
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg border px-2.5 py-1 text-xs font-medium transition hover:opacity-80 focus:outline-none"
              style={{
                borderColor: "var(--color-primary-300, #72C48C)",
                color: "var(--color-primary-700)",
                background: "rgba(46,139,87,0.07)",
              }}
            >
              <ImagePlus className="mr-1 inline size-3" />
              Add more
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept.join(",")}
        multiple
        className="hidden"
        onChange={handleInputChange}
      />

      {displayError && <p className="text-xs text-red-500">{displayError}</p>}
    </div>
  );
};

export default MultipleImageUploadField;
