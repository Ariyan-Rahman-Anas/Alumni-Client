// "use client"

// import { useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { FaCode } from "react-icons/fa6"
// import { LuDatabase, LuMonitorSmartphone, LuShieldCheck, LuZap, LuLayers } from "react-icons/lu"
// import { IoGlobeOutline } from "react-icons/io5"
// import { HiPlus, HiMinus } from "react-icons/hi2"
// import { BsCheckLg } from "react-icons/bs"
// import PrimaryButton from "@/components/shared/PrimaryButton"
// import SecondaryButton from "@/components/shared/SecondaryButton"
// import SectionLabel from "@/components/shared/SectionLabel"

// const fadeUp = (delay = 0) => ({
//   initial: { opacity: 0, y: 30 },
//   whileInView: { opacity: 1, y: 0 },
//   transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
//   viewport: { once: false },
// })

// // ── Data ─────────────────────────────────────────────────────

// const services = [
//   {
//     icon: <FaCode size={28} />,
//     title: "Full-Stack Web Development",
//     description: "Building modern, scalable, and responsive web applications using the latest technologies from front to back.",
//     color: "from-brand to-accent",
//     glow: "rgba(59,130,246,0.15)",
//     border: "rgba(59,130,246,0.3)",
//     stack: ["Next.js", "React", "Node.js", "TypeScript", "Tailwind CSS"],
//   },
//   {
//     icon: <LuDatabase size={28} />,
//     title: "Backend API Development",
//     description: "Creating robust RESTful and GraphQL APIs with authentication, authorization, and efficient database management.",
//     color: "from-green-400 to-emerald-600",
//     glow: "rgba(16,185,129,0.15)",
//     border: "rgba(16,185,129,0.3)",
//     stack: ["Express.js", "MongoDB", "PostgreSQL", "REST", "GraphQL"],
//   },
//   {
//     icon: <IoGlobeOutline size={28} />,
//     title: "Custom Web Solutions",
//     description: "Tailored web solutions including CMS, e-commerce, and SaaS platforms built to meet unique business needs.",
//     color: "from-accent to-cyan-400",
//     glow: "rgba(6,182,212,0.15)",
//     border: "rgba(6,182,212,0.3)",
//     stack: ["Shopify", "Stripe", "Firebase", "Sanity CMS", "Redux"],
//   },
//   {
//     icon: <LuMonitorSmartphone size={28} />,
//     title: "Responsive UI/UX Design",
//     description: "Crafting visually appealing and user-friendly designs optimized for desktop, tablet, and mobile users.",
//     color: "from-violet-400 to-brand",
//     glow: "rgba(139,92,246,0.15)",
//     border: "rgba(139,92,246,0.3)",
//     stack: ["Figma", "Framer Motion", "Tailwind CSS", "shadcn/ui"],
//   },
//   {
//     icon: <LuShieldCheck size={28} />,
//     title: "Auth & Security Integration",
//     description: "Implementing secure authentication systems, role-based access control, and data protection best practices.",
//     color: "from-rose-400 to-pink-600",
//     glow: "rgba(244,63,94,0.15)",
//     border: "rgba(244,63,94,0.3)",
//     stack: ["JWT", "NextAuth", "OAuth", "bcrypt", "Clerk"],
//   },
//   {
//     icon: <LuLayers size={28} />,
//     title: "Performance Optimization",
//     description: "Auditing and improving web app performance — faster load times, better SEO scores, and smoother UX.",
//     color: "from-amber-400 to-orange-500",
//     glow: "rgba(251,191,36,0.15)",
//     border: "rgba(251,191,36,0.3)",
//     stack: ["Lighthouse", "Web Vitals", "Lazy Loading", "CDN", "Caching"],
//   },
// ]

// const steps = [
//   { number: "01", title: "Discovery Call", description: "We discuss your goals, requirements, timeline, and budget in a free 30-min call." },
//   { number: "02", title: "Planning & Proposal", description: "I send a detailed proposal with scope, milestones, tech stack, and pricing." },
//   { number: "03", title: "Design & Develop", description: "I build iteratively with regular updates and demos for your feedback." },
//   { number: "04", title: "Review & Launch", description: "Final testing, refinements, and a smooth handoff or deployment." },
// ]

// const plans = [
//   {
//     name: "Starter",
//     price: "$299",
//     period: "one-time",
//     description: "Perfect for small projects and landing pages.",
//     color: "from-brand/20 to-accent/10",
//     border: "border-white/10",
//     badge: null,
//     features: [
//       "Up to 5 pages",
//       "Responsive design",
//       "Basic SEO setup",
//       "Contact form",
//       "1 revision round",
//       "7-day delivery",
//     ],
//   },
//   {
//     name: "Professional",
//     price: "$799",
//     period: "one-time",
//     description: "For businesses needing a full-featured web app.",
//     color: "from-brand/30 to-accent/20",
//     border: "border-brand/40",
//     badge: "Most Popular",
//     features: [
//       "Up to 15 pages",
//       "Full-stack development",
//       "Auth & dashboard",
//       "API integration",
//       "3 revision rounds",
//       "14-day delivery",
//     ],
//   },
//   {
//     name: "Enterprise",
//     price: "Custom",
//     period: "project-based",
//     description: "Tailored solutions for complex, large-scale needs.",
//     color: "from-accent/20 to-brand/10",
//     border: "border-white/10",
//     badge: null,
//     features: [
//       "Unlimited pages",
//       "Custom architecture",
//       "Priority support",
//       "Performance audit",
//       "Unlimited revisions",
//       "Flexible timeline",
//     ],
//   },
// ]

// const faqs = [
//   {
//     q: "How long does a typical project take?",
//     a: "Most projects take between 1–4 weeks depending on complexity. A simple landing page can be done in 3–5 days, while a full-stack SaaS app may take 3–6 weeks.",
//   },
//   {
//     q: "Do you work with clients outside Bangladesh?",
//     a: "Yes! I work with clients globally. I'm flexible with time zones and communicate via Slack, Email, or any preferred platform.",
//   },
//   {
//     q: "What do you need from me to get started?",
//     a: "A brief about your project — goals, references, content, and your preferred timeline. We'll handle the rest in our discovery call.",
//   },
//   {
//     q: "Do you offer post-launch support?",
//     a: "Yes. All plans include at least 7 days of post-launch support. Extended maintenance plans are also available on request.",
//   },
//   {
//     q: "Can I request changes after the project is done?",
//     a: "Yes, within your revision rounds. Additional changes beyond the included rounds are billed at an hourly rate agreed upfront.",
//   },
// ]

// const FAQItem = ({ q, a, index }: { q: string; a: string; index: number }) => {
//   const [open, setOpen] = useState(false)
//   return (
//     <motion.div
//       {...fadeUp(index * 0.05)}
//       className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm"
//     >
//       <button
//         onClick={() => setOpen(!open)}
//         className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
//       >
//         <span className="text-white font-medium text-sm md:text-base">{q}</span>
//         <span className="shrink-0 w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-text-secondary">
//           {open ? <HiMinus size={14} /> : <HiPlus size={14} />}
//         </span>
//       </button>
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.3, ease: "easeInOut" }}
//           >
//             <p className="px-6 pb-5 text-text-secondary text-sm leading-relaxed border-t border-white/10 pt-4">
//               {a}
//             </p>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   )
// }

// // ── Page ─────────────────────────────────────────────────────

// const Services = () => {
//   return (
//     // <div className="max-w-6xl mx-auto px-4 space-y-48 py-16">
//     <div className="page-setup">

//       {/* ══════════ HERO ══════════ */}
//       <section className="text-center">
//         <motion.div {...fadeUp(0)}>
//           <SectionLabel text="what I offer" />
//           <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
//             Services Built to{" "}
//             <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
//               Deliver Results
//             </span>
//           </h1>
//           <p className="mt-4 text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
//             Cutting-edge development, seamless user experiences, and scalable
//             web applications tailored to your needs.
//           </p>
//         </motion.div>
//       </section>

//       {/* ══════════ SERVICES GRID ══════════ */}
//       <section>
//         <motion.div {...fadeUp(0)} className="text-center mb-12">
//           <SectionLabel text="core services" />
//           <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">
//             What I{" "}
//             <span className="bg-gradient-to-r from-accent to-brand-light bg-clip-text text-transparent">
//               Do Best
//             </span>
//           </h2>
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           {services.map(({ icon, title, description, color, glow, border, stack }, i) => (
//             <motion.div
//               key={i}
//               {...fadeUp(i * 0.08)}
//               whileHover={{ scale: 1.02, borderColor: border }}
//               className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col gap-4 overflow-hidden transition-colors duration-300"
//             >
//               {/* Hover glow */}
//               <div
//                 className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
//                 style={{ background: `radial-gradient(circle at 20% 20%, ${glow}, transparent 65%)` }}
//               />

//               {/* Icon */}
//               <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} bg-opacity-10 flex items-center justify-center text-white shrink-0`}
//                 style={{ background: glow.replace("0.15", "0.2") }}>
//                 <span className={`bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
//                   {icon}
//                 </span>
//               </div>

//               {/* Title + desc */}
//               <div>
//                 <h3 className="text-white font-semibold text-base leading-snug">{title}</h3>
//                 <p className="mt-2 text-text-secondary text-sm leading-relaxed">{description}</p>
//               </div>

//               {/* Tech stack */}
//               <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-white/8">
//                 {stack.map((tech) => (
//                   <span key={tech} className="text-[10px] font-mono text-text-secondary border border-white/10 bg-white/5 px-2 py-0.5 rounded-md">
//                     {tech}
//                   </span>
//                 ))}
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* ══════════ WORK PROCESS ══════════ */}
//       <section>
//         <motion.div {...fadeUp(0)} className="text-center mb-12">
//           <SectionLabel text="how I work" />
//           <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">
//             My{" "}
//             <span className="bg-gradient-to-r from-accent via-brand to-brand-light bg-clip-text text-transparent">
//               Process
//             </span>
//           </h2>
//           <p className="mt-3 text-text-secondary text-base max-w-xl mx-auto">
//             A clear, collaborative process that keeps you informed at every step.
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
//           {steps.map(({ number, title, description }, i) => (
//             <motion.div
//               key={i}
//               {...fadeUp(i * 0.1)}
//               className="relative group bg-white/5 border border-white/10 hover:border-brand/30 rounded-2xl p-6 transition-colors duration-300"
//             >
//               {/* Step number */}
//               <span className="text-4xl font-black text-white/8 group-hover:text-white/15 transition-colors duration-300 select-none">
//                 {number}
//               </span>

//               {/* Connector arrow — desktop only */}
//               {i < steps.length - 1 && (
//                 <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-white/20 z-10 text-lg">
//                   →
//                 </div>
//               )}

//               <LuZap className="text-brand-light mt-2 mb-3 text-lg" />
//               <h3 className="text-white font-semibold text-sm">{title}</h3>
//               <p className="mt-1.5 text-text-secondary text-xs leading-relaxed">{description}</p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* ══════════ PRICING ══════════ */}
//       <section>
//         <motion.div {...fadeUp(0)} className="text-center mb-12">
//           <SectionLabel text="pricing" />
//           <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">
//             Simple,{" "}
//             <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
//               Transparent
//             </span>{" "}
//             Pricing
//           </h2>
//           <p className="mt-3 text-text-secondary text-base max-w-xl mx-auto">
//             No hidden fees. Pick a plan or reach out for a custom quote.
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
//           {plans.map(({ name, price, period, description, color, border, badge, features }, i) => (
//             <motion.div
//               key={i}
//               {...fadeUp(i * 0.1)}
//               className={`relative rounded-2xl border ${border} bg-gradient-to-br ${color} backdrop-blur-sm p-7 flex flex-col gap-5`}
//             >
//               {/* Popular badge */}
//               {badge && (
//                 <div className="absolute -top-3 left-1/2 -translate-x-1/2">
//                   <span className="text-xs font-mono font-semibold text-white bg-gradient-to-r from-brand to-accent px-4 py-1 rounded-full shadow-brand-sm">
//                     {badge}
//                   </span>
//                 </div>
//               )}

//               {/* Plan name + price */}
//               <div>
//                 <p className="text-text-secondary text-xs font-mono tracking-widest uppercase">{name}</p>
//                 <div className="flex items-end gap-1.5 mt-2">
//                   <span className="text-4xl font-black text-white">{price}</span>
//                   {price !== "Custom" && (
//                     <span className="text-text-secondary text-sm mb-1">{period}</span>
//                   )}
//                 </div>
//                 <p className="text-text-secondary text-sm mt-1">{description}</p>
//               </div>

//               {/* Divider */}
//               <div className="h-px bg-white/10" />

//               {/* Features */}
//               <ul className="space-y-2.5 flex-1">
//                 {features.map((f) => (
//                   <li key={f} className="flex items-center gap-2.5 text-sm text-text-secondary">
//                     <BsCheckLg className="text-brand-light shrink-0" />
//                     {f}
//                   </li>
//                 ))}
//               </ul>

//               {/* CTA */}
//               <PrimaryButton
//                 title={price === "Custom" ? "Let's Talk" : "Get Started"}
//                 isLinked={true}
//                 link="/contact"
//               />
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* ══════════ FAQ ══════════ */}
//       <section>
//         <motion.div {...fadeUp(0)} className="text-center mb-12">
//           <SectionLabel text="faq" />
//           <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">
//             Common{" "}
//             <span className="bg-gradient-to-r from-accent to-brand bg-clip-text text-transparent">
//               Questions
//             </span>
//           </h2>
//           <p className="mt-3 text-text-secondary text-base max-w-xl mx-auto">
//             Everything you need to know before we start working together.
//           </p>
//         </motion.div>

//         <div className="max-w-3xl mx-auto space-y-3">
//           {faqs.map(({ q, a }, i) => (
//             <FAQItem key={i} q={q} a={a} index={i} />
//           ))}
//         </div>
//       </section>

//       {/* ══════════ CTA ══════════ */}
//       <motion.section
//         {...fadeUp(0)}
//         className="relative text-center"
//       >
//         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//           <div className="w-[500px] h-[200px] bg-brand/10 blur-[100px] rounded-full" />
//         </div>

//         <div className="relative border border-white/10 bg-white/5 backdrop-blur-sm rounded-3xl px-8 py-16">
//           <SectionLabel text="let's build together" />
//           <h2 className="mt-3 text-3xl md:text-5xl font-bold text-white tracking-tight">
//             Have a Project in{" "}
//             <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
//               Mind?
//             </span>
//           </h2>
//           <p className="mt-4 text-text-secondary text-base max-w-xl mx-auto leading-relaxed">
//             Let&apos;s turn your idea into a real, polished product. Reach out
//             and let&apos;s talk about what you need.
//           </p>
//           <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-8">
//             <PrimaryButton title="Start a Project" isLinked={true} link="/contact" />
//             <SecondaryButton title="View My Work" isLinked={true} link="/projects" />
//           </div>
//         </div>
//       </motion.section>

//     </div>
//   )
// }
// export default Services