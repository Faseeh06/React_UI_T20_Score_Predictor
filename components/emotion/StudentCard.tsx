"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { EmotionBadge } from "./EmotionBadge"
import { Student, getEmotionColor, getEmotionEmoji, getEmotionLabel } from "@/lib/emotionSimulator"
import { cn } from "@/lib/utils"

interface StudentCardProps {
  student: Student
  onClick?: () => void
  showDetailedEmotion?: boolean
}

export function StudentCard({ student, onClick, showDetailedEmotion = true }: StudentCardProps) {
  const colorClasses = getEmotionColor(student.currentEmotion)
  const emotionEmoji = getEmotionEmoji(student.currentEmotion)
  const emotionLabel = getEmotionLabel(student.currentEmotion)

  // Extract border color from color classes for better visibility
  const borderColor = colorClasses.includes('green-600') ? 'border-green-600' :
                     colorClasses.includes('blue-600') ? 'border-blue-600' :
                     colorClasses.includes('orange-600') ? 'border-orange-600' :
                     colorClasses.includes('purple-600') ? 'border-purple-600' :
                     colorClasses.includes('slate-600') ? 'border-slate-600' :
                     'border-red-600'

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className={cn(
        "p-4 border-2 transition-all duration-300",
        borderColor,
        "hover:shadow-lg bg-card",
        // Ensure sufficient contrast with background
        "dark:bg-card dark:border-opacity-80"
      )}>
        <div className="flex items-start gap-3 mb-3">
          <Avatar className={cn(
            "h-10 w-10 text-white text-xs font-semibold border-2 border-white shadow-sm",
            student.avatarColor || "bg-slate-500",
            // Ensure avatar text is visible on colored backgrounds
            "dark:border-gray-800"
          )}>
            <AvatarFallback className="font-bold text-white">
              {student.avatar}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate text-foreground">
              {student.name}
            </p>
            {showDetailedEmotion && (
              <div className="mt-1.5">
                <EmotionBadge
                  emotion={student.currentEmotion}
                  size="sm"
                  showIcon={true}
                  className="font-medium"
                />
              </div>
            )}
          </div>
        </div>

        {/* Emotion indicator with both visual and text cues */}
        <div className="mb-3 p-2 rounded-md bg-muted/50 border">
          <div className="flex items-center gap-2">
            <span className="text-lg" role="img" aria-label={`${emotionLabel} emoji`}>
              {emotionEmoji}
            </span>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">
                {emotionLabel}
              </p>
              <p className="text-xs text-muted-foreground">
                Current state
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Detection Confidence</span>
            <span className="font-mono font-semibold text-foreground">
              {student.confidence}%
            </span>
          </div>
          <Progress
            value={student.confidence}
            className="h-2 bg-muted"
            // Ensure progress bar has sufficient contrast
            style={{
              '--progress-background': 'hsl(var(--primary))',
              '--progress-foreground': 'hsl(var(--primary))'
            } as React.CSSProperties}
          />
        </div>

        {!student.isOnline && (
          <div className="mt-3 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <span className="text-xs text-muted-foreground font-medium">
                Currently Offline
              </span>
            </div>
          </div>
        )}

        {/* Screen reader support */}
        <div className="sr-only">
          Student {student.name} is {student.isOnline ? 'online' : 'offline'}
          and currently feeling {emotionLabel.toLowerCase()}
          with {student.confidence}% detection confidence.
        </div>
      </Card>
    </motion.div>
  )
}

