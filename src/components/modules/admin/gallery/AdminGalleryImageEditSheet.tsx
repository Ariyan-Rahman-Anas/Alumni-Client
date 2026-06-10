"use client";

import { useEffect } from "react";
import { Controller, FormProvider, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, object, string, boolean } from "zod";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import InputField from "@/components/shared/InputField";
import TextAreaBox from "@/components/shared/TextAreaBox";
import SingleSelect from "@/components/shared/SingleSelect";
import { useFormWithToast } from "@/hooks/useFormWithToast";
import { useUpdateGalleryMutation, type GalleryImage, type UpdateGalleryPayload } from "@/redux/apis/galleryApi";
import { useGetAllPublishedImageCategoriesQuery } from "@/redux/apis/imageCategoryApi";
import { toast } from "sonner";
import PrimaryButton from "@/components/shared/PrimaryButton";
import ImageUploadField from "@/components/shared/ImageUploadField";

const editGallerySchema = object({
  title: string().min(1, "Title is required").max(100, "Title too long"),
  innerTitle: string().max(100, "Inner title too long").optional(),
  category: string({ error: "Please select a category" }).min(3, "Category must be at least 3 characters"),
  description: string().max(500, "Description too long").optional(),
  isPublished: boolean().optional(),
  image: z.instanceof(File).nullable().optional(),
});

type TEditFormValues = z.infer<typeof editGallerySchema>;

interface AdminGalleryImageEditSheetProps {
  item: GalleryImage | null;
  open: boolean;
  onClose: () => void;
}

const getCategoryId = (cat: GalleryImage["category"]): string => {
  if (typeof cat === "object") return cat._id;
  return cat;
};

const AdminGalleryImageEditSheet = ({ item, open, onClose }: AdminGalleryImageEditSheetProps) => {
  const [updateGallery, { isLoading }] = useUpdateGalleryMutation();
  const { data: categories, isLoading: categoriesLoading } = useGetAllPublishedImageCategoriesQuery(
    undefined,
    { skip: !open }
  );

  const categoryOptions =
    categories?.data.map((cat) => ({ label: cat.name, value: cat._id })) ?? [];

  const methods = useFormWithToast<TEditFormValues>({
    resolver: zodResolver(editGallerySchema) as unknown as Resolver<TEditFormValues>,
    defaultValues: {
      title: "",
      innerTitle: "",
      category: "",
      description: "",
      isPublished: false,
    },
  });

  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors },
  } = methods;

  // Populate form when item changes
  useEffect(() => {
    if (item && open) {
      reset({
        title: item.title ?? "",
        innerTitle: item.innerTitle ?? "",
        category: getCategoryId(item.category),
        description: item.description ?? "",
        isPublished: item.isPublished ?? false,
        image: null,
      });
    }
  }, [item, open, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleOnSubmit = async (data: TEditFormValues) => {
    if (!item) return;

    const payload: UpdateGalleryPayload = {
      title: data.title,
      innerTitle: data.innerTitle || undefined,
      category: data.category,
      description: data.description || undefined,
      isPublished: data.isPublished,

    };

    try {
      const updateRes = await updateGallery({ id: item._id, payload, image: data.image ?? undefined }).unwrap();
      toast.success(updateRes?.message || "Gallery image updated successfully");
      handleClose();
    } catch { }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent
        side="right"
        className="w-full sm:!max-w-md bg-white flex flex-col p-0 gap-0"
        showCloseButton={false}
      >
        <SheetHeader className="px-6 py-4 border-b border-surface-300 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-base font-semibold text-gray-900">
                Edit Gallery Image
              </SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update the metadata for this image.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-gray-900"
            >

            </Button>
          </div>
        </SheetHeader>

        {/* Current image preview */}
        {item?.imageUrl && (
          <div className="px-6 pt-4 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-40 w-full rounded-xl object-cover border border-gray-200"
            />
          </div>
        )}

        <FormProvider {...methods}>
          <form
            noValidate
            onSubmit={handleSubmit(handleOnSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

              {/* <ImageUploadField
                value={imageFile}
                onChange={setImageFile}
                label="Profile Image"
                helperText="JPG, PNG or WEBP ” square or portrait photo works best"
              /> */}


              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ImageUploadField
                    label="Image (optional)"
                    value={field.value ?? null}
                    onChange={field.onChange}
                    previewUrl={item?.imageUrl}
                    error={errors.image?.message as string}
                  />
                )}
              />



              <InputField
                label="Title"
                {...register("title")}
                error={errors.title?.message}
                placeholder="Image title"
                required
              />

              <InputField
                label="Inner Title (optional)"
                {...register("innerTitle")}
                error={errors.innerTitle?.message}
                placeholder="Per-image caption or sub-title"
              />

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <SingleSelect
                    id="edit-gallery-category"
                    label="Category"
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    options={categoryOptions}
                    placeholder="Select category"
                    searchPlaceholder="Search category"
                    error={errors.category?.message}
                    isLoading={categoriesLoading}
                    required
                  />
                )}
              />

              <TextAreaBox
                label="Description (optional)"
                {...register("description")}
                error={errors.description?.message}
                placeholder="Brief description"
                rows={3}
              />

              <div className="flex items-center gap-2">
                <Controller
                  name="isPublished"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
                      <input
                        type="checkbox"
                        checked={field.value ?? false}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary2-600 focus:ring-green-500"
                      />
                      Published
                    </label>
                  )}
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-surface-300 flex justify-end gap-2 shrink-0">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <PrimaryButton
                type="submit"
                title={isLoading ? "Saving..." : "Save Changes"}
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

export default AdminGalleryImageEditSheet;
