// import { BiGlobe } from 'react-icons/bi';
// import { CgLock } from 'react-icons/cg';
// import { FiZap } from 'react-icons/fi';
// import { motion } from 'framer-motion';

// const ContactPageStates = () => {
//   const stats = [
//     {
//       icon: <FiZap className="w-5 h-5" />,
//       value: '24h',
//       label: 'Response Time',
//     },
//     {
//       icon: <BiGlobe className="w-5 h-5" />,
//       value: '50+',
//       label: 'Projects Completed',
//     },
//     {
//       icon: <CgLock className="w-5 h-5" />,
//       value: '3+',
//       label: 'Years Experience',
//     },
//   ];
//   return (
//     <motion.div
//       initial={{ opacity: 0, transform: 'translateY(30px)' }}
//       whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
//       transition={{ duration: 0.8 }}
//       viewport={{ once: false }}
//       className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
//     >
//       {stats.map((stat, index) => (
//         <div
//           key={index}
//           className="bg-card backdrop-blur-lg border border-border rounded-2xl p-6 text-center hover:bg-card-hover transition-all duration-300"
//         >
//           <div className="inline-flex items-center justify-center w-12 h-12 bg-brand/20 rounded-lg mb-4 text-brand">
//             {stat.icon}
//           </div>
//           <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
//           <div className="text-text-secondary">{stat.label}</div>
//         </div>
//       ))}
//     </motion.div>
//   );
// };
// export default ContactPageStates;













"use client"

import { motion } from "framer-motion"
import { FiZap } from "react-icons/fi"
import { BiGlobe } from "react-icons/bi"
import { CgLock } from "react-icons/cg"

const stats = [
  { icon: <FiZap className="text-lg" />, value: "24h", label: "Response Time", color: "text-brand-light", bg: "bg-brand/15", border: "border-brand/20" },
  { icon: <BiGlobe className="text-lg" />, value: "18+", label: "Projects Completed", color: "text-accent", bg: "bg-accent/15", border: "border-accent/20" },
  { icon: <CgLock className="text-lg" />, value: "2+", label: "Years Experience", color: "text-green-400", bg: "bg-green-400/15", border: "border-green-400/20" },
]

const ContactPageStats = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {stats.map(({ icon, value, label, color, bg, border }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          viewport={{ once: false }}
          whileHover={{ scale: 1.03 }}
          className={`flex items-center gap-4 bg-white/5 backdrop-blur-sm border ${border} rounded-2xl p-5 transition-colors duration-300`}
        >
          <div className={`w-11 h-11 rounded-xl ${bg} border ${border} flex items-center justify-center ${color} shrink-0`}>
            {icon}
          </div>
          <div>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-text-secondary text-sm">{label}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
export default ContactPageStats