// import { BiMapPin, BiPhone } from 'react-icons/bi';
// import { BsArrowRight } from 'react-icons/bs';
// import { MdOutlineMarkEmailUnread } from 'react-icons/md';

// const ContactPageContactInfo = () => {
//   const contactInfo = [
//     {
//       icon: <MdOutlineMarkEmailUnread className="w-6 h-6" />,
//       label: 'Email',
//       value: 'anas.hllw@gmail.com',
//       href: 'mailto:anas.hllw@gmail.com',
//       description: 'Send me an email anytime',
//     },
//     {
//       icon: <BiPhone className="w-6 h-6" />,
//       label: 'Phone',
//       value: '+88 01610-195968',
//       href: 'tel:+8801610195968',
//       description: 'Call me for urgent matters',
//     },
//     {
//       icon: <BiMapPin className="w-6 h-6" />,
//       label: 'Location',
//       value: 'Khulshi, Chattogram',
//       href: '#',
//       description: 'Bangladesh',
//     },
//   ];
//   return (
//     <div className="space-y-8">
//       <div className="bg-card backdrop-blur-lg border border-border rounded-3xl p-8">
//         <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
//           <div className="w-2 h-8 bg-gradient-to-b from-brand to-accent rounded-full"></div>
//           Contact Information
//         </h2>

//         <div className="space-y-6">
//           {contactInfo.map((item, index) => (
//             <a
//               key={index}
//               href={item.href}
//               className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-card-hover transition-all duration-300"
//             >
//               <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-brand to-accent rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
//                 {item.icon}
//               </div>
//               <div className="flex-grow">
//                 <div className="text-text-secondary text-sm font-medium">
//                   {item.label}
//                 </div>
//                 <div className="text-white text-lg font-semibold group-hover:text-brand transition-colors">
//                   {item.value}
//                 </div>
//                 <div className="text-text-secondary text-sm">
//                   {item.description}
//                 </div>
//               </div>
//               <BsArrowRight className="w-5 h-5 text-text-secondary group-hover:text-brand group-hover:translate-x-1 transition-all duration-300" />
//             </a>
//           ))}
//         </div>
//       </div>

//       {/* Availability Section */}
//       <div className="bg-success/10 border border-success/20 rounded-3xl p-8">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
//           <span className="text-success font-semibold">
//             Available for new projects
//           </span>
//         </div>
//         <p className="text-text-secondary">
//           {`I'm currently accepting new freelance projects and full-time opportunities. 
//                 Let's discuss how we can work together!`}
//         </p>
//       </div>
//     </div>
//   );
// };
// export default ContactPageContactInfo;















"use client"

import { motion } from "framer-motion"
import { BiMapPin, BiPhone } from "react-icons/bi"
import { MdOutlineMarkEmailUnread } from "react-icons/md"
import { BsArrowRight } from "react-icons/bs"

const contactInfo = [
  {
    icon: <MdOutlineMarkEmailUnread className="text-lg" />,
    label: "Email",
    value: "anas.hllw@gmail.com",
    href: "mailto:anas.hllw@gmail.com",
    description: "Send me an email anytime",
    color: "text-brand-light",
    bg: "bg-brand/15",
    border: "border-brand/20",
  },
  {
    icon: <BiPhone className="text-lg" />,
    label: "Phone",
    value: "+88 01610-195968",
    href: "tel:+8801610195968",
    description: "Call me for urgent matters",
    color: "text-accent",
    bg: "bg-accent/15",
    border: "border-accent/20",
  },
  {
    icon: <BiMapPin className="text-lg" />,
    label: "Location",
    value: "Khulshi, Chattogram",
    href: "#",
    description: "Bangladesh",
    color: "text-green-400",
    bg: "bg-green-400/15",
    border: "border-green-400/20",
  },
]

const ContactPageContactInfo = () => {
  return (
    <div className="flex flex-col gap-5">

      {/* Contact cards */}
      <div className="flex flex-col gap-3">
        {contactInfo.map(({ icon, label, value, href, description, color, bg, border }, i) => (
          <motion.a
            key={i}
            href={href}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: false }}
            whileHover={{ x: 4 }}
            className="group flex items-center gap-4 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 backdrop-blur-sm rounded-2xl p-5 transition-all duration-300"
          >
            {/* Icon */}
            <div className={`w-11 h-11 rounded-xl ${bg} border ${border} flex items-center justify-center ${color} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
              {icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-text-secondary text-xs font-mono tracking-wider uppercase">{label}</p>
              <p className={`text-white font-semibold text-sm mt-0.5 group-hover:${color} transition-colors duration-200 truncate`}>
                {value}
              </p>
              <p className="text-text-secondary text-xs mt-0.5">{description}</p>
            </div>

            <BsArrowRight className={`text-text-secondary group-hover:${color} group-hover:translate-x-1 transition-all duration-300 shrink-0`} />
          </motion.a>
        ))}
      </div>

      {/* Availability card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        viewport={{ once: false }}
        className="bg-green-500/8 border border-green-500/20 rounded-2xl p-5 flex items-start gap-4"
      >
        <div className="relative mt-1 shrink-0">
          <span className="w-3 h-3 rounded-full bg-green-400 block" />
          <span className="w-3 h-3 rounded-full bg-green-400 block absolute inset-0 animate-ping opacity-60" />
        </div>
        <div>
          <p className="text-green-400 font-semibold text-sm">Available for new projects</p>
          <p className="text-text-secondary text-sm mt-1 leading-relaxed">
            Currently accepting freelance projects and full-time opportunities.
            Let&apos;s discuss how we can work together!
          </p>
        </div>
      </motion.div>

    </div>
  )
}
export default ContactPageContactInfo