"use client"

import PrimaryButton from "@/components/shared/PrimaryButton"
import { useCreateSkillMutation } from "@/redux/apis/skillsApi"
import { useRouter } from "next/navigation"
import { useEffect } from "react"


const SkillCreateForm = () => {
    const router = useRouter()
    const [createSkill, { data, isSuccess, isLoading, error: skillCreateError }] = useCreateSkillMutation()
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const skillData = {
            name: formData.get("name")?.toString(),
            category: formData.get("category")?.toString(),
            color: formData.get("color")?.toString()
        }
        await createSkill(skillData)
        form.reset()
    }

    useEffect(() => {
        if (isSuccess && data) {
            alert(data?.message)
            console.log(isSuccess === true)
            console.log({data, isSuccess})
            alert(data?.message)
            router.replace("/arapdash/skills")
        }
        if (skillCreateError && "data" in skillCreateError) {
            alert((skillCreateError as any)?.data?.message)
        }
    }, [isSuccess, skillCreateError, data])

    console.log({data, skillCreateError})

    return (
        <div>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="input-group">
                        <label htmlFor="name">Skill Name</label>
                        <input type="text" name="name" id="name" className="input-field" placeholder="Skill Name" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="color">Color</label>
                        <input type="text" name="color" id="color" className="input-field" placeholder="Skill Color" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="category">Category</label>
                        <select name="category" id="category" className="input-field" required>
                            <option value="">Select Category</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Fullstack">Fullstack</option>
                            <option value="Tools">Tools</option>
                        </select>
                    </div>
                </div>
                <PrimaryButton buttonType="submit" title={isLoading ? "Creating..." : "Create"} isLinked={false} />
            </form>
        </div>
    )
}
export default SkillCreateForm