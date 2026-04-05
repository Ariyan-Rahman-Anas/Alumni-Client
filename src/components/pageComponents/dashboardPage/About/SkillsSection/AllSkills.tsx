"use client"
import ApiLoadingLoader from "@/components/shared/ApiLoadingLoader"
import { useDeleteSkillMutation, useGetAllSkillsQuery } from "@/redux/apis/skillsApi"
import { FaEdit } from "react-icons/fa"
import { FaTrash } from "react-icons/fa6"
import { useEffect } from "react"

const AllSkills = () => {
  const { data, isLoading } = useGetAllSkillsQuery("")
  const [deleteSkill, { data: deletedSkillData, isSuccess: isDeleted, error: isDeletingError }] = useDeleteSkillMutation()

  useEffect(() => {
    if (isDeleted) {
      alert("Skill deleted successfully")
      alert(deletedSkillData?.message)
    }
    if (isDeletingError) {
      alert((isDeletingError as any)?.data?.message)
    }
  }, [isDeleted, isDeletingError, deletedSkillData])

  const frontendSkills = data?.skills.filter(({ category }: any) => category === "Frontend")
  const backendSkills = data?.skills.filter(({ category }: any) => category === "Backend")
  const fullstackSkills = data?.skills.filter(({ category }: any) => category === "Fullstack")
  const toolsSkills = data?.skills.filter(({ category }: any) => category === "Tools")

  console.log({data, frontendSkills, backendSkills, fullstackSkills, toolsSkills})

  if (isLoading) return <ApiLoadingLoader />

  const SkillCategoryCard = ({ skills, category }: any) => {
    return (
      <div className="text-sm">
        <h2 className="sub-sub-heading">{category}:</h2>
        <div className="flex flex-wrap gap-x-8 gap-y-4 ml-3 mt-4" >
          {skills?.map(({ name, _id }: any, idx: number) => (
            <div key={idx} className="border-2 border-black py-1 px-4 rounded relative">
              <h2>{name}</h2>
              <button className="absolute -top-3 -left-3 h-5 w-5 bg-yellow-500 rounded flex items-center justify-center text-white ">
                <FaEdit />
              </button>
              <button className="absolute -top-3 -right-3 h-5 w-5 bg-red-500 rounded flex items-center justify-center text-white ">
                <FaTrash onClick={() => deleteSkill(_id)}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-8">
      <SkillCategoryCard skills={frontendSkills} category="Frontend" />
      <SkillCategoryCard skills={backendSkills} category="Backend" />
      <SkillCategoryCard skills={fullstackSkills} category="Fullstack" />
      <SkillCategoryCard skills={toolsSkills} category="Tools" />
    </div>
  )
}
export default AllSkills