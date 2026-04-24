import { z, object, string } from "zod";

const createGallerySchema = object({
  category: string({ error: "Category is required" })
    .min(1, "Category is required")
    .max(50, "Category must be at most 50 characters"),
  title: string().max(100, "Title must be at most 100 characters").optional(),
  description: string().max(500, "Description must be at most 500 characters").optional(),
});

export type TGalleryCreateFormValues = z.infer<typeof createGallerySchema>;

export const galleryValidation = {
  createGallerySchema,
  galleryFormFieldOrder: ["category", "title", "description"] as (keyof TGalleryCreateFormValues)[],
};
