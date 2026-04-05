"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import PrimaryButton from "@/components/shared/PrimaryButton"
import {
    useCreateExperienceMutation,
    useUpdateExperienceMutation,
} from "@/redux/apis/experiencesApi"
import { ExperienceI } from "@/types/experiences.types"



type Props = {
    mode: "create" | "edit"
    id?: string
    initialData?: ExperienceI
    setOpenForm: (open: boolean) => void
}

const ExperienceForm = ({ mode, id, initialData, setOpenForm }: Props) => {
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)

    const [createExperience, { isLoading: creating }] =
        useCreateExperienceMutation()

    const [updateExperience, { isLoading: updating }] =
        useUpdateExperienceMutation()

    const isLoading = creating || updating

    // 🔥 populate form when editing
    useEffect(() => {
        if (initialData && formRef.current) {
            Object.entries(initialData).forEach(([key, value]) => {
                const field = formRef.current!.elements.namedItem(
                    key
                ) as HTMLInputElement | HTMLTextAreaElement | null

                if (field && value !== undefined && value !== null) {
                    field.value = String(value)
                }
            })
        }
    }, [initialData])

    useEffect(() => {
        if (initialData && formRef.current) {
            Object.entries(initialData).forEach(([key, value]) => {
                const field = formRef.current!.elements.namedItem(
                    key
                ) as HTMLInputElement | HTMLTextAreaElement | null

                if (!field || value === undefined || value === null) return

                // ⭐ handle date inputs
                if (field.type === "date") {
                    const date = new Date(value as string)
                    field.value = date.toISOString().split("T")[0] // YYYY-MM-DD
                } else {
                    field.value = String(value)
                }
            })
        }
    }, [initialData])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        const payload = {
            title: formData.get("title")?.toString(),
            employmentType: formData.get("employmentType")?.toString(),
            company: formData.get("company")?.toString(),
            startDate: formData.get("startDate")?.toString(),
            endDate: formData.get("endDate")?.toString(),
            duration: Number(formData.get("duration")),
            current: formData.get("current")?.toString(),
            location: formData.get("location")?.toString(),
            workType: formData.get("workType")?.toString(),
            skills: formData.get("skills")?.toString(),
            serialNumber: Number(formData.get("serialNumber")),
            description: formData.get("description")?.toString(),
        }

        try {
            if (mode === "edit" && id) {
                const updateResult = await updateExperience({ id, ...payload }).unwrap()
                alert(updateResult?.message)
            } else {
                const result = await createExperience(payload).unwrap()
                alert(result?.message)
            }
            router.replace("/arapdash/experiences")
            setOpenForm(false)
        } catch (error: any) {
            alert(error?.data?.message)
        }
    }

    return (
        <form ref={formRef} className="space-y-4 pl-2" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="input-group">
                    <label>Title</label>
                    <input name="title" className="input-field" required />
                </div>

                <div className="input-group">
                    <label>Employment Type</label>
                    <select name="employmentType" className="input-field" required>
                        <option value="">Select</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>Company</label>
                    <input name="company" className="input-field" required />
                </div>

                <div className="input-group">
                    <label>Start Date</label>
                    <input type="date" name="startDate" className="input-field" required />
                </div>

                <div className="input-group">
                    <label>End Date</label>
                    <input type="date" name="endDate" className="input-field" />
                </div>

                <div className="input-group">
                    <label>Duration (months)</label>
                    <input type="number" name="duration" className="input-field" />
                </div>

                <div className="input-group">
                    <label>Location</label>
                    <input name="location" className="input-field" required />
                </div>

                <div className="input-group">
                    <label>Work Type</label>
                    <select name="workType" className="input-field" required>
                        <option value="">Select</option>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>Skills</label>
                    <input name="skills" className="input-field" required />
                </div>

                <div className="input-group">
                    <label>Serial Number</label>
                    <input type="number" name="serialNumber" className="input-field" required />
                </div>

                <div className="input-group w-full">
                    <label>Description</label>
                    <textarea name="description" className="input-field" required />
                </div>
            </div>

            <div className="flex justify-end">
                <PrimaryButton
                    buttonType="submit"
                    disabled={isLoading}
                    title={
                        isLoading
                            ? mode === "edit"
                                ? "Updating..."
                                : "Creating..."
                            : mode === "edit"
                                ? "Update Experience"
                                : "Create Experience"
                    }
                    isLinked={false}
                />
            </div>
        </form>
    )
}

export default ExperienceForm