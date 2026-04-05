"use client"

import { useGetExperienceByIdQuery } from "@/redux/apis/experiencesApi"
import { useParams } from "next/navigation"
import ExperienceCreateForm from "@/components/pageComponents/dashboardPage/Experiences/ExperienceCreateForm"
import PrimaryButton from "@/components/shared/PrimaryButton"
import { useState } from "react"

const ExperienceEditPage = () => {
    const [openForm, setOpenForm] = useState(false)

    const { id } = useParams()
    const { data: experienceData } = useGetExperienceByIdQuery(id, { skip: !id })

    console.log({ experienceData })

    return (
        <div>

            <div className='flex items-center justify-between'>
                <h1 className="sub-heading">{openForm ? "Edit Experience" : "Experiences"}</h1>
                <div>
                    <PrimaryButton title={openForm ? "Close" : "Add Experience"} onClickFunc={() => setOpenForm(!openForm)} />
                </div>
            </div>

            <ExperienceCreateForm mode="edit"
                id={id as string}
                initialData={experienceData?.experience}
                setOpenForm={setOpenForm}
            />
        </div>
    )
}
export default ExperienceEditPage