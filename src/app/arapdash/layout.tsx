"use client"

import { ReactNode } from 'react'
import Image from 'next/image'
import { images } from '@/assets'
import PrimaryButton from '@/components/shared/PrimaryButton'
import AdminDashboardSidebar from '@/components/pageComponents/dashboardPage/AdminDashboardSidebar'

interface UserLayoutProps {
  children: ReactNode
}

const AdminDashboardLayout = ({ children }: UserLayoutProps) => {
  return (
    <div className="w-full mx-2 md:mx-4 mb-14">
      <div className='mt-6 mb-4 w-full text-sm rounded-lg md:rounded-md shadow-lg md:shadow-md p-4 md:p-2.5 hidden md:flex items-start justify-between '>
        <div className='flex md:flex-row flex-col items-center justify-between gap-6'>
          <div className='flex items-center w-full md:w-fit justify-between gap-2'>
            <div className='w-24 h-24 rounded-full border-2 border-mColor6 object-cover '>
              <Image src={images.Anas} alt="user" className='w-full h-full object-cover rounded-full ' />
            </div>
          </div>
          <div className='w-full'>
            <h1 className={` text-lg font-semibold `} >Anas Rahman Anas</h1>
            <p>anas.hllw@gmail.com</p>
          </div>
        </div>
        <PrimaryButton title='Change Picture' link='/' />
      </div>

      <div className='flex md:flex-row flex-col items-start gap-4 '>
        <AdminDashboardSidebar />

        {/* Main Content Area */}
        <main className="w-full overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
export default AdminDashboardLayout