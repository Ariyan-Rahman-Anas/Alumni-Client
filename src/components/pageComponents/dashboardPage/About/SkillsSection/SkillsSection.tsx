"use client"
import SkillCreateForm from './SkillCreateForm'
import AllSkills from './AllSkills'
import { useState } from 'react'
import PrimaryButton from '@/components/shared/PrimaryButton'

const SkillsSection = () => {
  const [openForm, setOpenForm] = useState(false)
  return (
    <div>
      <div className='flex items-center justify-between'>
        <h1 className="sub-heading">{openForm ? "Add New Skill" : "Skills"}</h1>
        <div>
          <PrimaryButton title={openForm ? "Close" : "Add Skill"} onClickFunc={() => setOpenForm(!openForm)} />
        </div>
      </div>
      <div>
        {
          openForm ? <SkillCreateForm /> : <div>
            <AllSkills />
          </div>
        }
      </div>
    </div>
  )
}
export default SkillsSection