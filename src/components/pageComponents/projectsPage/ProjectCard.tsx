"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { FaGithub } from "react-icons/fa"
import { LuExternalLink, LuServer, LuMonitor } from "react-icons/lu"
import Link from "next/link"

const ProjectCard = ({ project }: any) => {
  const {
    name, details, image, liveLink,
    frontCode, backCode, frontTech, backTech,
  } = project || {}

  const [imgError, setImgError] = useState(false)

  const parseTech = (arr: string[]) =>
    arr?.flatMap((t: string) => t.split(",").map((s: string) => s.trim())) ?? []

  const clientTech = parseTech(frontTech)
  const serverTech = parseTech(backTech)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group relative flex flex-col bg-white/5 border border-white/10 hover:border-brand/30 rounded-2xl overflow-hidden backdrop-blur-sm transition-colors duration-300 h-full"
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden h-48 shrink-0">
        {!imgError ? (
          <Image
            src={image}
            alt={name}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center">
            <span className="text-text-secondary text-sm font-mono">no image</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060d1f] via-[#060d1f]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Details on hover */}
        <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-text-secondary text-xs leading-relaxed line-clamp-3">
            {details}
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-5 gap-4">

        {/* Name */}
        <h3 className="text-white font-semibold text-base leading-snug group-hover:text-brand-light transition-colors duration-200">
          {name}
        </h3>

        {/* Tech stacks */}
        <div className="flex flex-col gap-2 flex-1">
          {clientTech.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5">
                <LuMonitor className="text-brand-light text-xs" />
              </span>
              <div className="flex flex-wrap gap-1">
                {clientTech.slice(0, 5).map((t: string) => (
                  <span key={t} className="text-[10px] font-mono text-text-secondary border border-white/10 bg-white/5 px-2 py-0.5 rounded-md">
                    {t}
                  </span>
                ))}
                {clientTech.length > 5 && (
                  <span className="text-[10px] font-mono text-text-secondary px-1">
                    +{clientTech.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}

          {serverTech.length > 0 && backCode && (
            <div className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5">
                <LuServer className="text-accent text-xs" />
              </span>
              <div className="flex flex-wrap gap-1">
                {serverTech.slice(0, 5).map((t: string) => (
                  <span key={t} className="text-[10px] font-mono text-text-secondary border border-white/10 bg-white/5 px-2 py-0.5 rounded-md">
                    {t}
                  </span>
                ))}
                {serverTech.length > 5 && (
                  <span className="text-[10px] font-mono text-text-secondary px-1">
                    +{serverTech.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Action buttons ── */}
        <div className="flex items-center gap-2 pt-3 border-t border-white/8 mt-auto">
          {frontCode && (
            <Link href={frontCode} target="_blank" className="flex-1">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-brand/15 border border-white/10 hover:border-brand/30 text-text-secondary hover:text-white text-xs font-medium transition-all duration-200"
              >
                <FaGithub size={13} />
                Client
              </motion.div>
            </Link>
          )}

          {backCode && (
            <Link href={backCode} target="_blank" className="flex-1">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-accent/15 border border-white/10 hover:border-accent/30 text-text-secondary hover:text-white text-xs font-medium transition-all duration-200"
              >
                <FaGithub size={13} />
                Server
              </motion.div>
            </Link>
          )}

          {liveLink && (
            <Link href={liveLink} target="_blank" className="flex-1">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gradient-to-r from-brand/20 to-accent/20 hover:from-brand/30 hover:to-accent/30 border border-brand/20 hover:border-brand/40 text-white text-xs font-medium transition-all duration-200"
              >
                <LuExternalLink size={13} />
                Live
              </motion.div>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
export default ProjectCard