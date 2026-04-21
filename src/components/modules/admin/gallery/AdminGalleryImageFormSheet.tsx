

"use client";

import { useState } from "react";
import { FormProvider, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import InputField from "@/components/shared/InputField";
import TextAreaBox from "@/components/shared/TextAreaBox";
import ImageUploadField from "@/components/shared/ImageUploadField";
import { useFormWithToast } from "@/hooks/useFormWithToast";
import { useCreateImageCategoryMutation } from "@/redux/apis/imageCategoryApi";
import { toast } from "sonner";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { imageCategoryFieldOrder, imageCategorySchema } from "../imageCategories/imageCategorySchema";

export interface ImageCategoryFormValues {
    name: string;
    description: string;
    coverImage: File | null;
}

interface AdminImageCategoryFormProps {
    open: boolean;
    onClose: () => void;
}

const AdminGalleryImageFormSheet = ({ open, onClose }: AdminImageCategoryFormProps) => {
    const [imageFile, setImageFile] = useState<File | null>(null);


    const [createImageCategory, { isLoading: isCreatingImageCategory }] = useCreateImageCategoryMutation()

    const methods = useFormWithToast<ImageCategoryFormValues>(
        {
            resolver: zodResolver(imageCategorySchema) as unknown as Resolver<ImageCategoryFormValues>,
            defaultValues: {
                name: "",
                description: "",
            },
        },
        { fieldOrder: imageCategoryFieldOrder }
    );
    const { handleSubmit, reset, control,
        // setValue,
        formState: { errors } } = methods;

    const handleOnSubmit = async (data: ImageCategoryFormValues) => {
        const payload = {
            name: data.name,
            description: data.description,
        }
        try {
            const createRes = await createImageCategory({ payload, image: imageFile }).unwrap();
            toast.success(createRes.message ?? "Image category created successfully");
            setImageFile(null);
            reset();
            onClose();
        } catch (error) {
            toast.error(
                (error as { data?: { message?: string } })?.data?.message ??
                `Failed to create image category`
            );
        }
    }

    // useEffect(() => {
    //     if (open) {
    //         reset({
    //             name: initialValues?.name || "",
    //             description: initialValues?.description || "",
    //             coverImage: null,
    //         });
    //     }
    // }, [open, initialValues, reset]);

    return (
        <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
            <SheetContent side="right" className="w-full sm:!max-w-md bg-white flex flex-col p-0 gap-0" showCloseButton={false}>
                <SheetHeader className="px-6 py-4 border-b border-surface-300 shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <SheetTitle className="text-base font-semibold text-gray-900">
                                {/* {initialValues ? "Edit Image Category" : "Create New Image Category"} */}11
                            </SheetTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">0101
                                {/* {initialValues ? "Update the image category details below." : "Fill in the details to add a new image category."} */}
                            </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-muted-foreground hover:text-gray-900">✕</Button>
                    </div>
                </SheetHeader>
                <FormProvider {...methods}>
                    <form
                        noValidate
                        onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col flex-1 min-h-0">
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                            <Controller
                                name="coverImage"
                                control={control}
                                render={({ field }) => (
                                    <ImageUploadField
                                        value={field.value}
                                        onChange={setImageFile}
                                        // onChange={file => setValue("coverImage", file)}
                                        label="Cover Image"
                                        error={errors.coverImage?.message as string}
                                    />
                                )}
                            />
                            <InputField
                                label="Category Name"
                                {...methods.register("name")}
                                error={errors.name?.message as string}
                                placeholder="Enter category"
                                required
                            />
                            <TextAreaBox
                                label="Description"
                                {...methods.register("description")}
                                error={errors.description?.message as string}
                                placeholder="Enter description"
                                rows={3}
                            />
                        </div>
                        <div className="px-6 py-4 border-t border-surface-300 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isCreatingImageCategory}>
                                Cancel
                            </Button>
                            <PrimaryButton
                                type="submit"
                                title={isCreatingImageCategory ? "Adding..." : "Add Category"}
                                isDisabled={isCreatingImageCategory}
                                isLoading={isCreatingImageCategory}
                            />
                        </div>
                    </form>
                </FormProvider>
            </SheetContent>
        </Sheet>
    );
};
export default AdminGalleryImageFormSheet;