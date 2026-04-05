"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BsCartCheck } from 'react-icons/bs';
import { FaRegAddressCard } from 'react-icons/fa';
import { LuLayoutDashboard } from 'react-icons/lu'
import { RiAccountCircleLine } from "react-icons/ri";


const AdminDashboardSidebar = () => {
  const pathname = usePathname()

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LuLayoutDashboard />,
      href: '/arapdash/dashboard',
    },
    {
      title: 'Skills',
      icon: <RiAccountCircleLine />,
      href: '/arapdash/skills',
    },
    {
      title: 'Educations',
      icon: <RiAccountCircleLine />,
      href: '/arapdash/educations',
    },
    {
      title: 'Experiences',
      icon: <FaRegAddressCard />,
      href: '/arapdash/experiences',
    },
    {
      title: 'Projects',
      icon: <FaRegAddressCard />,
      href: '/arapdash/projects',
    },
    {
      title: 'Certificates',
      icon: <BsCartCheck />,
      href: '/arapdash/certificates',
    },
  ]

  return (
    <aside className={`w-full md:w-80 h-full shadow shadow-brand rounded-md transform transition-transform duration-500 ease-in-out lg:translate-x-0`}>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2.5 space-y-2 hidden md:block ">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-purple-500 ' : ''
                }`}
            >
              <span className="flex-1">{item.title}</span>
            </Link>
          )
        })}
      </nav>

      {/* Mobile Menu */}
      <div className='md:hidden flex items-center justify-between gap-2 mt-4'>
        {
          menuItems.map(({ icon, href }, idx) => {
            const isActive = pathname === href
            return (
              <Link
                key={idx}
                href={href}
                className={`flex items-center justify-center border shadow-lg w-full text-center p-2 text-2xl font-medium rounded-lg transition-colors ${isActive ? 'bg-gray-200 border-r-2 border-gray-200 ' : 'text-bColor2'
                  }`}
              >
                <span>{icon}</span>
              </Link>
            )
          })
        }
      </div>
    </aside>
  )
}
export default AdminDashboardSidebar