"use client";

import { useState } from "react";
import { Controller, FormProvider, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import InputField from "@/components/shared/InputField";
import TextAreaBox from "@/components/shared/TextAreaBox";
import MultipleImageUploadField from "@/components/shared/MultipleImageUploadField";
import { useFormWithToast } from "@/hooks/useFormWithToast";
import { useCreateGalleryMutation } from "@/redux/apis/galleryApi";
import { toast } from "sonner";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { galleryValidation, type TGalleryCreateFormValues } from "@/components/modules/admin/gallery/gallerySchema";
import { useGetAllPublishedImageCategoriesQuery } from "@/redux/apis/imageCategoryApi";
import SingleSelect from "@/components/shared/SingleSelect";
import { RiInformationLine } from "react-icons/ri";
import { useSchoolInfo } from "@/hooks/useSchoolInfo";

interface UserContributeGallerySheetProps {
    open: boolean;
    onClose: () => void;
}

const UserContributeGallerySheet = ({ open, onClose }: UserContributeGallerySheetProps) => {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [innerTitles, setInnerTitles] = useState<string[]>([]);
    const [imageError, setImageError] = useState<string>("");

    const { data: publishedImageCategories, isLoading: categoriesLoading } =
        useGetAllPublishedImageCategoriesQuery(undefined, { skip: !open });

    const imageCategoryOptions =
        publishedImageCategories?.data.map((cat) => ({
            label: cat.name,
            value: cat._id,
        })) ?? [];

    const [createGallery, { isLoading }] = useCreateGalleryMutation();

    const methods = useFormWithToast<TGalleryCreateFormValues>(
        {
            resolver: zodResolver(galleryValidation.createGallerySchema) as unknown as Resolver<TGalleryCreateFormValues>,
            defaultValues: { category: "", title: "", description: "" },
        },
        { fieldOrder: galleryValidation.galleryFormFieldOrder }
    );

    const { handleSubmit, reset, register, control, formState: { errors } } = methods;

    const handleClose = () => {
        reset();
        setImageFiles([]);
        setInnerTitles([]);
        setImageError("");
        onClose();
    };

    const handleOnSubmit = async (data: TGalleryCreateFormValues) => {
        if (imageFiles.length === 0) {
            setImageError("At least one image is required");
            return;
        }
        setImageError("");
        try {
            const result = await createGallery({
                payload: {
                    category: data.category,
                    title: data.title || undefined,
                    description: data.description || undefined,
                },
                images: imageFiles,
                innerTitles: imageFiles.length > 1 ? innerTitles : undefined,
            }).unwrap();
            toast.success(result.message ?? "Images submitted for review!");
            handleClose();
        } catch { }
    };

    const { shortName } = useSchoolInfo();

    return (
        <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
            <SheetContent
                side="right"
                className="w-full sm:!max-w-md bg-white dark:bg-gunmetal-600 flex flex-col p-0 gap-0"
                showCloseButton={false}
            >
                <SheetHeader className="px-6 py-4 border-b border-surface-300 shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <SheetTitle className="text-base font-semibold text-primary2-900 dark:text-gunmetal-200">
                                Contribute Photos
                            </SheetTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Submit your {shortName} memories to the gallery archive.
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-gray-900"
                        >
                            ✕
                        </Button>
                    </div>
                </SheetHeader>

                {/* Info banner */}
                <div className="mx-6 mt-4 flex items-start gap-2.5 rounded-xl border px-4 text-warning-dark py-3 text-xs dark:text-gunmetal-200 bg-warning/10 dark:bg-gunmetal-300/10 border-warning/20 dark:border-gunmetal-300">
                    <RiInformationLine className="flex-shrink-0 mt-0.5 text-base" />
                    Your photos will be reviewed by an admin before appearing in the public gallery.
                </div>

                <FormProvider {...methods}>
                    <form
                        noValidate
                        onSubmit={handleSubmit(handleOnSubmit)}
                        className="flex flex-col flex-1 min-h-0"
                    >
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                            <MultipleImageUploadField
                                label="Images"
                                required
                                onChange={(files) => {
                                    setImageFiles(files);
                                    if (files.length > 0) setImageError("");
                                }}
                                onInnerTitlesChange={setInnerTitles}
                                error={imageError}
                                maxFiles={10}
                            />

                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <SingleSelect
                                        id="contribute-gallery-category"
                                        label="Category"
                                        value={field.value || ""}
                                        onValueChange={field.onChange}
                                        options={imageCategoryOptions}
                                        placeholder="Select category"
                                        searchPlaceholder="Search category"
                                        error={errors.category?.message}
                                        isLoading={categoriesLoading}
                                        required
                                    />
                                )}
                            />

                            <InputField
                                label="Title"
                                {...register("title")}
                                error={errors.title?.message}
                                placeholder="Shared title for all uploaded photos"
                            />

                            <TextAreaBox
                                label="Description"
                                {...register("description")}
                                error={errors.description?.message}
                                placeholder="Brief context about these photos"
                                rows={3}
                            />
                        </div>

                        <div className="px-6 py-4 border-t border-surface-300 flex justify-between gap-2 shrink-0">
                            <PrimaryButton
                                title="Cancel"
                                variant="outline"
                                isDisabled={isLoading}
                                onClick={handleClose}
                                className="border border-danger dark:border-gunmetal-400 text-danger font-semibold dark:text-gunmetal-300 dark:bg-transparent hover:bg-danger/5 dark:hover:bg-gunmetal-300/10"
                            />
                            <PrimaryButton
                                type="submit"
                                title={isLoading ? "Submitting..." : "Submit Photos"}
                                isDisabled={isLoading}
                                isLoading={isLoading}
                            />
                        </div>
                    </form>
                </FormProvider>
            </SheetContent>
        </Sheet>
    );
};
export default UserContributeGallerySheet;
