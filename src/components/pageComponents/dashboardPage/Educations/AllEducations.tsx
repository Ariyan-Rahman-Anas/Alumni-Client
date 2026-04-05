"use client"

import { useGetAllEducationsQuery } from "@/redux/apis/educationsApi"
import { FaTrash } from "react-icons/fa6"
import { useDeleteEducationMutation } from "@/redux/apis/educationsApi"
import { useEffect } from "react"

const AllEducations = () => {
    const { data } = useGetAllEducationsQuery("")
    const [deleteEducation, { data: deleteEducationData, isSuccess: deleteEducationSuccess, isLoading: deleteEducationLoading, error: deleteEducationError }] = useDeleteEducationMutation()

    useEffect(() => {
        if (deleteEducationSuccess && deleteEducationData) {
            alert(deleteEducationData?.message)
        }
        if (deleteEducationError && "data" in deleteEducationError) {
            alert((deleteEducationError as any)?.data?.message)
        }
    }, [deleteEducationSuccess, deleteEducationData, deleteEducationError])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {
                data?.educations?.map((item: any, index: number) => <div key={index} className="border border-black p-3 rounded-lg" >
                    <p className='font-semibold'>{item.degree}</p>
                    <p className='text-gray-500'>{item.institute}</p>
                    <div className="flex items-center gap-2 font-semibold text-sm mt-2 mb-1">
                        <p className='black-badge'>{item.point}</p>
                        <p className='black-badge'>{item.outOf}</p>
                    </div>
                    <p className='text-sm my-3'>{item.description}</p>
                    <button onClick={() => deleteEducation(item._id)} disabled={deleteEducationLoading} className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"><FaTrash /></button>
                </div>)
            }
        </div>
    )
}
export default AllEducations