"use client"

import { FaTrash } from "react-icons/fa6"
import { useDeleteExperienceMutation, useGetAllExperiencesQuery } from "@/redux/apis/experiencesApi"
import { ExperienceI } from "@/types/experiences.types"
import { DateFormatter } from "@/components/shared/DateFormatter"
import { FaEdit } from "react-icons/fa"
import Link from "next/link"

const AllExperiences = () => {
    const { data } = useGetAllExperiencesQuery("")
    console.log({ data })
    const [deleteExperience, { isLoading: deleteExperienceLoading }] = useDeleteExperienceMutation()

    const handleDeleteExp = async (id: string) => {
        try {
            const deleteRe = await deleteExperience(id).unwrap()
            alert(deleteRe.message)
        } catch (error: any) {
            alert(error?.data?.message)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {
                data?.experiences?.map((experience: ExperienceI, index: number) => <div key={index} className="border border-brand p-3 rounded-lg" >
                    <p className='text-gray-200 font-medium'>{experience.serialNumber} - {experience.title}</p>
                    <p className='text-gray-300'>{experience.company}</p>
                    <p className="text-sm text-gray-400" >
                        <span>
                            <DateFormatter date={experience.startDate ?? ""} />
                        </span>
                        <span> to </span>
                        {experience.endDate && <span>
                            <DateFormatter date={experience.endDate ?? ""} />
                        </span>}
                        {experience.current && <span> Current</span>}
                    </p>
                    <div className="flex items-center justify-between mt-3 ">
                        <button
                            onClick={() => handleDeleteExp(experience?._id as string)} disabled={deleteExperienceLoading}
                            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:text-danger "><FaTrash /></button>
                        <Link href={`/arapdash/experiences/${experience._id}`} className="cursor-pointer hover:text-warning ">
                            <FaEdit />
                        </Link>
                    </div>
                </div>)
            }
        </div>
    )
}
export default AllExperiences