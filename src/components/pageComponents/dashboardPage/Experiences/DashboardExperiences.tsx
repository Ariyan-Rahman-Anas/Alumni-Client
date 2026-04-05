"use client"

import PrimaryButton from "@/components/shared/PrimaryButton"
import { useState } from "react"
import ExperienceCreateForm from "./ExperienceCreateForm"
import AllExperiences from "./AllExperiences"

const DashboardExperiences = () => {
    const [openForm, setOpenForm] = useState(false)

    return (
        <div className="space-y-4 md:pr-4">
            <div className='flex items-center justify-between'>
                <h1 className="sub-heading">{openForm ? "Add New Experience" : "Experiences"}</h1>
                <div>
                    <PrimaryButton title={openForm ? "Close" : "Add Experience"} onClickFunc={() => setOpenForm(!openForm)} />
                </div>
            </div>
            <div className="">
                {
                    openForm ? <ExperienceCreateForm setOpenForm={setOpenForm} mode="create" /> : <div>
                        <AllExperiences />
                    </div>
                }
            </div>
        </div>
    )
}
export default DashboardExperiences