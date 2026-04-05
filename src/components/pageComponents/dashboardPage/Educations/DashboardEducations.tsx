"use client"
import EducationCreateForm from './EducationCreateForm'
import { useState } from 'react'
import PrimaryButton from '@/components/shared/PrimaryButton'
import AllEducations from './AllEducations'

const DashboardEducations = () => {
  const [openForm, setOpenForm] = useState(false)
  return (
    <div>
      <div className='flex items-center justify-between'>
        <h1 className="sub-heading">{openForm ? "Add New Education" : "Educations"}</h1>
        <div>
        <PrimaryButton title={openForm ? "Close" : "Add Education"} onClickFunc={() => setOpenForm(!openForm)} />
        </div>
      </div>
      <div>
        {
          openForm ? <EducationCreateForm /> : <div>
            <AllEducations />
          </div>
        }
      </div>
    </div>
  )
}
export default DashboardEducations