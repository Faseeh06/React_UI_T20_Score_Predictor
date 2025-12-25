"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Users, GraduationCap, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SelectRolePage() {
  const router = useRouter()

  const roles = [
    {
      id: "instructor",
      title: "Instructor Dashboard",
      description: "Monitor class engagement, view real-time emotion analytics, and manage interventions",
      icon: GraduationCap,
      href: "/instructor",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/50"
    },
    {
      id: "student",
      title: "Student View",
      description: "Experience the student perspective with emotion tracking and personalized insights",
      icon: Users,
      href: "/student",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/50"
    }
  ]

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background flex items-center justify-center px-6 py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Link 
            href="/"
            className="inline-block mb-6 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
          <h1 className="font-sans text-4xl md:text-6xl font-light tracking-tight mb-4">
            Select Your Role
          </h1>
          <p className="font-mono text-muted-foreground max-w-xl mx-auto">
            Choose how you want to experience the Emotion-Aware Virtual Classroom
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {roles.map((role, index) => {
            const Icon = role.icon
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={role.href}>
                  <Card className={`
                    relative p-8 md:p-12 h-full 
                    border-2 cursor-pointer
                    ${role.borderColor}
                    bg-card/50 backdrop-blur-sm
                    hover:bg-card/70
                    transition-all duration-300
                    group
                    overflow-hidden
                  `}>
                    {/* Background Accent */}
                    <div className={`
                      absolute top-0 right-0 w-32 h-32 
                      ${role.bgColor}
                      rounded-full blur-3xl
                      opacity-50
                      group-hover:opacity-75
                      transition-opacity
                    `} />

                    <div className="relative z-10">
                      {/* Icon */}
                      <div className={`
                        inline-flex p-4 rounded-xl border-2 mb-6
                        ${role.borderColor}
                        ${role.bgColor}
                        group-hover:scale-110
                        transition-transform duration-300
                      `}>
                        <Icon className={`w-8 h-8 ${role.color}`} />
                      </div>

                      {/* Content */}
                      <h2 className="font-sans text-2xl md:text-3xl font-medium mb-3">
                        {role.title}
                      </h2>
                      <p className="font-mono text-sm text-muted-foreground mb-6">
                        {role.description}
                      </p>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-sm font-mono">
                        <span className={role.color}>Enter Dashboard</span>
                        <ArrowRight className={`w-4 h-4 ${role.color} group-hover:translate-x-1 transition-transform`} />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="font-mono text-xs text-muted-foreground">
            This is a prototype demonstration. All data is simulated.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

