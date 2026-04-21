import {z, object, string} from "zod" 

const createImageCategorySchema = object({
  name: string({error: "Category name is required"}).min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters"),
  description: string().max(500, "Description must be at most 500 characters").optional(),
})

const imageCategoryFormFieldOrder: (keyof TImageCategoryCreteFormValues)[] = ["name", "description"];

export const imageCategoryValidation = {
  createImageCategorySchema,
  imageCategoryFormFieldOrder
}

export type TImageCategoryCreteFormValues = z.infer<typeof createImageCategorySchema> extends infer O ? O & { coverImage: File | null } : never;

export interface AdminImageCategoryFormProps {
    open: boolean;
    onClose: () => void;
}