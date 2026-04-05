"use client"

import PrimaryButton from "@/components/shared/PrimaryButton"
import { useCreateEducationMutation } from "@/redux/apis/educationsApi"
import { useRouter } from "next/navigation"
import { useEffect } from "react"


const EducationCreateForm = () => {
    const router = useRouter()
    const [createEducation, { data, isSuccess, isLoading, error: educationCreateError }] = useCreateEducationMutation()
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const educationData = {
            degree: formData.get("degree")?.toString(),
            institute: formData.get("institute")?.toString(),
            point: formData.get("point")?.toString(),
            outOf: formData.get("outOf")?.toString(),
            description: formData.get("description")?.toString()
        }
        await createEducation(educationData)
        form.reset()
    }

    useEffect(() => {
        if (isSuccess && data) {
            alert(data?.message)
            alert(data?.message)
            router.replace("/arapdash/educations")
        }
        if (educationCreateError && "data" in educationCreateError) {
            alert((educationCreateError as any)?.data?.message)
        }
    }, [isSuccess, educationCreateError, data])


    return (
        <div>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row flex-wrap gap-2">
                    <div className="input-group">
                        <label htmlFor="degree">Degree</label>
                        <input type="text" name="degree" id="degree" className="input-field" placeholder="Degree" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="institute">Institute</label>
                        <input type="text" name="institute" id="institute" className="input-field" placeholder="Institute" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="point">Point</label>
                        <input type="text" name="point" id="point" className="input-field" placeholder="Stand Point" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="outOf">Out of</label>
                        <input type="text" name="outOf" id="outOf" className="input-field" placeholder="Out of" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="description">Description</label>
                        <textarea name="description" id="description" className="input-field" placeholder="Description" required></textarea>
                    </div>
                </div>
                <PrimaryButton buttonType="submit" disabled={isLoading} title={isLoading ? "Creating..." : "Create Education"} isLinked={false} />
            </form>
        </div>
    )
}
export default EducationCreateForm