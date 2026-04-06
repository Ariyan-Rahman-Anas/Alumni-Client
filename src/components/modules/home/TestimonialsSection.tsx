// import { FadeUpWrapper } from "@/components/Pages/Home/HomePage"
// import { AnimatePresence, motion } from "framer-motion"
// import { useEffect, useState } from "react";
// import { RiArrowLeftSLine, RiArrowRightSLine, RiDoubleQuotesL } from "react-icons/ri"

// const TestimonialsSection = () => {
//     /* Testimonial slider */
//     const [tIdx, setTIdx] = useState(0);
//     useEffect(() => {
//         const t = setInterval(() => setTIdx(i => (i + 1) % testimonials.length), 5000);
//         return () => clearInterval(t);
//     }, []);

//     const testimonials = [
//         {
//             quote: "BAMHS shaped who I am. The values I learned in those classrooms still guide every decision I make as a doctor today.",
//             name: "Dr. Rafiqul Islam",
//             batch: "Batch of 1998",
//             role: "Senior Physician, Dhaka Medical College",
//         },
//         {
//             quote: "No matter where life took me, BAMHS always felt like home. The friendships forged here are for a lifetime.",
//             name: "Nasrin Akter",
//             batch: "Batch of 2005",
//             role: "Software Engineer, Dubai",
//         },
//         {
//             quote: "My teachers at BAMHS didn&apos;t just teach subjects — they taught us how to stand tall with dignity and purpose.",
//             name: "Md. Karim Hossain",
//             batch: "Batch of 1992",
//             role: "Entrepreneur, Chittagong",
//         },
//         {
//             quote: "The school&apos;s annual sports day and cultural programs made us who we are. I owe everything to BAMHS.",
//             name: "Sadia Rahman",
//             batch: "Batch of 2010",
//             role: "Teacher, Cumilla Govt. College",
//         },
//     ];

//     return (
//         <section className="relative overflow-hidden"
//             style={{ background: "linear-gradient(135deg, #0A3D2B 0%, #0F3C24 100%)" }}>
//             {/* grid */}
//             <div className="absolute inset-0 pointer-events-none"
//                 style={{
//                     backgroundImage: "linear-gradient(rgba(46,139,87,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.05) 1px, transparent 1px)",
//                     backgroundSize: "48px 48px",
//                 }} />

//             <div className="three-xl-section-setup relative z-10">
//                 <FadeUpWrapper className="text-center mb-14">
//                     <span className="text-label block mb-3" style={{ color: "var(--color-primary-400)" }}>
//                         Alumni Voices
//                     </span>
//                     <h2 className="section-heading" style={{ color: "var(--color-primary-50)" }}>
//                         What BAMHSians Say
//                     </h2>
//                 </FadeUpWrapper>

//                 <div className="max-w-3xl mx-auto">
//                     <AnimatePresence mode="wait">
//                         <motion.div
//                             key={tIdx}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -20 }}
//                             transition={{ duration: 0.45, ease: "easeOut" }}
//                             className="text-center"
//                         >
//                             <RiDoubleQuotesL className="text-4xl mx-auto mb-6"
//                                 style={{ color: "var(--color-primary-500)" }} />
//                             <p className="font-serif italic text-xl md:text-2xl leading-relaxed mb-8"
//                                 style={{ color: "var(--color-primary-100)" }}>
//                                 "{testimonials[tIdx].quote}"
//                             </p>
//                             <div className="flex flex-col items-center gap-1">
//                                 <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg mb-2"
//                                     style={{ background: "rgba(46,139,87,0.25)", color: "var(--color-primary-200)" }}>
//                                     {testimonials[tIdx].name.charAt(0)}
//                                 </div>
//                                 <p className=" font-semibold text-base"
//                                     style={{ color: "var(--color-primary-100)" }}>
//                                     {testimonials[tIdx].name}
//                                 </p>
//                                 <p className=" text-xs tracking-wider"
//                                     style={{ color: "var(--color-primary-400)" }}>
//                                     {testimonials[tIdx].batch} · {testimonials[tIdx].role}
//                                 </p>
//                             </div>
//                         </motion.div>
//                     </AnimatePresence>

//                     {/* Dots + arrows */}
//                     <div className="flex items-center justify-center gap-4 mt-10">
//                         <button onClick={() => setTIdx(i => (i - 1 + testimonials.length) % testimonials.length)}
//                             className="w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:scale-110"
//                             style={{ borderColor: "rgba(46,139,87,0.35)", color: "var(--color-primary-300)" }}>
//                             <RiArrowLeftSLine />
//                         </button>
//                         <div className="flex gap-2">
//                             {testimonials.map((_, i) => (
//                                 <button key={i} onClick={() => setTIdx(i)}
//                                     className="rounded-full transition-all duration-300"
//                                     style={{
//                                         width: i === tIdx ? "24px" : "8px",
//                                         height: "8px",
//                                         background: i === tIdx ? "var(--color-primary-400)" : "rgba(46,139,87,0.30)",
//                                     }}
//                                 />
//                             ))}
//                         </div>
//                         <button onClick={() => setTIdx(i => (i + 1) % testimonials.length)}
//                             className="w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:scale-110"
//                             style={{ borderColor: "rgba(46,139,87,0.35)", color: "var(--color-primary-300)" }}>
//                             <RiArrowRightSLine />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     )
// }
// export default TestimonialsSection






import { FadeUpWrapper } from "@/components/Pages/Home/HomePage"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine, RiDoubleQuotesL } from "react-icons/ri"

/* ✅ stable outside component */
const testimonials = [
    {
        quote: "BAMHS shaped who I am. The values I learned in those classrooms still guide every decision I make as a doctor today.",
        name: "Dr. Rafiqul Islam",
        batch: "Batch of 1998",
        role: "Senior Physician, Dhaka Medical College",
    },
    {
        quote: "No matter where life took me, BAMHS always felt like home. The friendships forged here are for a lifetime.",
        name: "Nasrin Akter",
        batch: "Batch of 2005",
        role: "Software Engineer, Dubai",
    },
    {
        quote: "My teachers at BAMHS didn&apos;t just teach subjects — they taught us how to stand tall with dignity and purpose.",
        name: "Md. Karim Hossain",
        batch: "Batch of 1992",
        role: "Entrepreneur, Chittagong",
    },
    {
        quote: "The school&apos;s annual sports day and cultural programs made us who we are. I owe everything to BAMHS.",
        name: "Sadia Rahman",
        batch: "Batch of 2010",
        role: "Teacher, Cumilla Govt. College",
    },
];

const TestimonialsSection = () => {
    const [tIdx, setTIdx] = useState(0);

    useEffect(() => {
        const t = setInterval(
            () => setTIdx(i => (i + 1) % testimonials.length),
            5000
        );
        return () => clearInterval(t);
    }, []); // ✅ now valid

    return (
        <section
            className="relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0A3D2B 0%, #0F3C24 100%)" }}
        >
            {/* grid */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(46,139,87,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.05) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            <div className="three-xl-section-setup relative z-10">
                <FadeUpWrapper className="text-center mb-14">
                    <span
                        className="text-label block mb-3"
                        style={{ color: "var(--color-primary-400)" }}
                    >
                        Alumni Voices
                    </span>
                    <h2
                        className="section-heading"
                        style={{ color: "var(--color-primary-50)" }}
                    >
                        What BAMHSians Say
                    </h2>
                </FadeUpWrapper>

                <div className="max-w-3xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tIdx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.45, ease: "easeOut" }}
                            className="text-center"
                        >
                            <RiDoubleQuotesL
                                className="text-4xl mx-auto mb-6"
                                style={{ color: "var(--color-primary-500)" }}
                            />

                            {/* ✅ no illegal quotes */}
                            <p
                                className="font-serif italic text-xl md:text-2xl leading-relaxed mb-8"
                                style={{ color: "var(--color-primary-100)" }}
                            >
                                &ldquo;{testimonials[tIdx].quote}&rdquo;
                            </p>

                            <div className="flex flex-col items-center gap-1">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg mb-2"
                                    style={{
                                        background: "rgba(46,139,87,0.25)",
                                        color: "var(--color-primary-200)",
                                    }}
                                >
                                    {testimonials[tIdx].name.charAt(0)}
                                </div>

                                <p
                                    className=" font-semibold text-base"
                                    style={{ color: "var(--color-primary-100)" }}
                                >
                                    {testimonials[tIdx].name}
                                </p>

                                <p
                                    className=" text-xs tracking-wider"
                                    style={{ color: "var(--color-primary-400)" }}
                                >
                                    {testimonials[tIdx].batch} ·{" "}
                                    {testimonials[tIdx].role}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Dots + arrows */}
                    <div className="flex items-center justify-center gap-4 mt-10">
                        <button
                            onClick={() =>
                                setTIdx(
                                    i => (i - 1 + testimonials.length) % testimonials.length
                                )
                            }
                            className="w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:scale-110"
                            style={{
                                borderColor: "rgba(46,139,87,0.35)",
                                color: "var(--color-primary-300)",
                            }}
                        >
                            <RiArrowLeftSLine />
                        </button>

                        <div className="flex gap-2">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setTIdx(i)}
                                    className="rounded-full transition-all duration-300"
                                    style={{
                                        width: i === tIdx ? "24px" : "8px",
                                        height: "8px",
                                        background:
                                            i === tIdx
                                                ? "var(--color-primary-400)"
                                                : "rgba(46,139,87,0.30)",
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() =>
                                setTIdx(i => (i + 1) % testimonials.length)
                            }
                            className="w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:scale-110"
                            style={{
                                borderColor: "rgba(46,139,87,0.35)",
                                color: "var(--color-primary-300)",
                            }}
                        >
                            <RiArrowRightSLine />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;