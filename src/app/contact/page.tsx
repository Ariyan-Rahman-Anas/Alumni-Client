"use client"

import { motion } from "framer-motion"
import ContactForm from "@/components/pageComponents/contactPage/ContactForm"
import ContactPageContactInfo from "@/components/pageComponents/contactPage/ContactPageContactInfo"
import ContactPageHeader from "@/components/pageComponents/contactPage/ContactPageHeader"
import ContactPageStats from "@/components/pageComponents/contactPage/ContactPageStats"
import ContactPageCTA from "@/components/pageComponents/contactPage/ContactPageCTA"

const ContactPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
      {/* <ContactPageHeader />
      <ContactPageStats />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as any }}
        viewport={{ once: false }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-10"
      >
        <ContactPageContactInfo />
        <ContactForm />
      </motion.div>

      <ContactPageCTA /> */}
    </div>
  )
}
export default ContactPage