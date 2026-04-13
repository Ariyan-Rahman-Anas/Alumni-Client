import { z, object, string } from "zod";

export const imageCategorySchema = object({
    name: string().min(2, "Name is required"),
    description: string().optional(),
});
export type ImageCategoryFormValues = z.infer<typeof imageCategorySchema>;

export const imageCategoryUpdateSchema = imageCategorySchema.partial();
export type ImageCategoryUpdateValues = z.infer<typeof imageCategoryUpdateSchema>;

export const imageCategoryFieldOrder: (keyof ImageCategoryFormValues)[] = ["name", "description"];