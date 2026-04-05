import Image from "next/image"
import Link from "next/link"

const ProjectCardLink = ({ title, link, icon, imgIcon, className }: { title: string, link?: string, icon?: React.ReactNode, imgIcon?: string, className?: any}) => {
  return (
    <Link href={link!} className={`flex items-center justify-between gap-1.5 px-3 py-1 border-2 border-gray-300 text-gray-300 duration-300 ${className}`}>
      <span>
        {title}
      </span>
      {icon && icon}
      {imgIcon && title && <Image src={imgIcon} alt={title} height={50} width={50} />}
    </Link>
  )
}
export default ProjectCardLink