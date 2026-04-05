"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BiSend, BiCheckCircle } from "react-icons/bi"
import { BsPerson } from "react-icons/bs"
import { API_CONFIG } from "@/lib/config"
import PrimaryButton from "@/components/shared/PrimaryButton"
import { HiOutlineEnvelope } from "react-icons/hi2"
import { TiMessage } from "react-icons/ti"
import { TfiCommentAlt } from "react-icons/tfi"

const MAX = 2000

const inputClass = (active: boolean, error?: boolean) =>
    `w-full px-4 py-3.5 bg-white/5 border rounded-xl text-white text-sm placeholder-text-secondary
   focus:outline-none transition-all duration-300 resize-none
   ${error ? "border-danger/60 bg-danger/5"
        : active ? "border-brand/50 bg-brand/5"
            : "border-white/10 hover:border-white/20"}`

const ContactForm = () => {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
    const [active, setActive] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("")

    const msgLen = form.message.length
    const atLimit = msgLen >= MAX

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (name === "message" && value.length > MAX) return
        setForm(p => ({ ...p, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)
        setError("")
        try {
            const res = await fetch(API_CONFIG.form_url as string, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })
            if (res.ok) {
                setSubmitted(true)
                setForm({ name: "", email: "", subject: "", message: "" })
                setTimeout(() => setSubmitted(false), 4000)
            } else {
                const d = await res.json()
                throw new Error(d.error || "Failed to send")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unexpected error")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-7 bg-gradient-to-b from-brand to-accent rounded-full" />
                <h2 className="text-xl font-bold text-white">Send a Message</h2>
            </div>

            <AnimatePresence mode="wait">
                {submitted ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center justify-center py-16 gap-4 text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                            <BiCheckCircle className="text-green-400 text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                        <p className="text-text-secondary text-sm max-w-xs">
                            Thank you for reaching out. I&apos;ll get back to you within 24 hours.
                        </p>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {/* Error */}
                        {error && (
                            <div className="bg-danger/10 border border-danger/30 rounded-xl p-3 text-danger text-sm">
                                {error}
                            </div>
                        )}

                        {/* Name + Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono text-text-secondary flex items-center gap-1.5 uppercase tracking-wider">
                                    <BsPerson className="text-brand-light" /> Name*
                                </label>
                                <input
                                    type="text" name="name" value={form.name}
                                    onChange={handleChange}
                                    onFocus={() => setActive("name")}
                                    onBlur={() => setActive("")}
                                    required placeholder="Your name"
                                    className={inputClass(active === "name")}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono text-text-secondary flex items-center gap-1.5 uppercase tracking-wider">
                                    <HiOutlineEnvelope className="text-brand-light" /> Email*
                                </label>
                                <input
                                    type="email" name="email" value={form.email}
                                    onChange={handleChange}
                                    onFocus={() => setActive("email")}
                                    onBlur={() => setActive("")}
                                    required placeholder="your@email.com"
                                    className={inputClass(active === "email")}
                                />
                            </div>
                        </div>

                        {/* Subject */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono text-text-secondary flex items-center gap-1.5 uppercase tracking-wider">
                                <TiMessage className="text-brand-light" /> Subject*
                            </label>
                            <input
                                type="text" name="subject" value={form.subject}
                                onChange={handleChange}
                                onFocus={() => setActive("subject")}
                                onBlur={() => setActive("")}
                                required placeholder="What's this about?"
                                className={inputClass(active === "subject")}
                            />
                        </div>

                        {/* Message */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-mono text-text-secondary flex items-center gap-1.5 uppercase tracking-wider">
                                    <TfiCommentAlt className="text-brand-light" /> Message*
                                </label>
                                <span className={`text-xs font-mono ${atLimit ? "text-danger" : "text-text-secondary"}`}>
                                    {msgLen}/{MAX}
                                </span>
                            </div>
                            <textarea
                                name="message" value={form.message}
                                onChange={handleChange}
                                onFocus={() => setActive("message")}
                                onBlur={() => setActive("")}
                                required rows={5}
                                placeholder="Tell me about your project or just say hello!"
                                className={inputClass(active === "message", atLimit)}
                            />
                            {atLimit && (
                                <p className="text-danger text-xs">Character limit reached</p>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="pt-1">
                            <PrimaryButton
                                buttonType="submit"
                                title={submitting ? "Sending..." : "Send Message"}
                                disabled={submitting || atLimit}
                                icon={<BiSend className="group-hover:translate-x-1 transition-transform duration-300" />}
                            />
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    )
}
export default ContactForm