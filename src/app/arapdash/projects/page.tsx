"use client"

import ApiLoadingLoader from '@/components/shared/ApiLoadingLoader'
import { useDeleteProjectMutation, useGetAllProjectsQuery } from '@/redux/apis/projectsApi'
import React from 'react'
import { FaEdit } from 'react-icons/fa'
import { FaDeleteLeft } from 'react-icons/fa6'
import PrimaryButton from '@/components/shared/PrimaryButton'
import ProjectCreateForm from '@/components/pageComponents/dashboardPage/Project/ProjectCreateForm'

const DashboardProjectsPage = () => {
  const [openForm, setOpenForm] = React.useState(false)
  const { data: projects, isLoading: isProjectsLoading } = useGetAllProjectsQuery("")

  const [deleteProject] = useDeleteProjectMutation()

  const handleDeleteProject = async (id: string) => {
    const deletedProject = await deleteProject(id)
    console.log("deletedProject", deletedProject)
    if (deletedProject?.data?.success === true) {
      alert(deletedProject?.data?.message)
    }
  }

  if (isProjectsLoading) {
    return <ApiLoadingLoader />
  }

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between'>
        <h1 className="sub-heading">{openForm ? "Add New Project" : "Projects"}</h1>
        <div>
          <PrimaryButton title={openForm ? "Close" : "Add Project"} onClickFunc={() => setOpenForm(!openForm)} />
        </div>
      </div>

      {
        openForm
          ? <ProjectCreateForm />
          : <div className='flex flex-wrap gap-5 pt-6'>
            {projects?.projects?.map((project: any) => (
              <div key={project?._id} className='w-fit shadow shadow-gray-400 rounded-md px-8 py-2 relative '>
                <h1 className='absolute top-1 left-2 text-gray-300 font-semibold'>{project?.serialNumber}</h1>
                <p>{project?.name}</p>
                <FaDeleteLeft className='absolute top-0 right-1 text-red-500 cursor-pointer' onClick={() => handleDeleteProject(project?._id)} />
                <FaEdit className='absolute bottom-0 right-1 text-amber-500 cursor-pointer' onClick={() => handleDeleteProject(project?._id)} />
              </div>
            ))}
          </div>
      }
    </div>
  )
}

export default DashboardProjectsPage