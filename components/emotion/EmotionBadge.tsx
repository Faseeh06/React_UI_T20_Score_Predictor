"use client"

import { Badge } from "@/components/ui/badge"
import { Emotion, getEmotionEmoji, getEmotionColor, getEmotionLabel } from "@/lib/emotionSimulator"
import { cn } from "@/lib/utils"
import { Smile, Target, Minus, Frown, Moon, Angry } from "lucide-react"

interface EmotionBadgeProps {
  emotion: Emotion
  showEmoji?: boolean
  showIcon?: boolean
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Get icon for emotion (alternative to color-only identification)
function getEmotionIcon(emotion: Emotion) {
  const icons = {
    happy: Smile,
    engaged: Target,
    neutral: Minus,
    confused: Frown,
    bored: Moon,
    frustrated: Angry
  }
  return icons[emotion]
}

export function EmotionBadge({
  emotion,
  showEmoji = true,
  showIcon = false,
  showLabel = true,
  size = 'md',
  className
}: EmotionBadgeProps) {
  const emoji = getEmotionEmoji(emotion)
  const label = getEmotionLabel(emotion)
  const colorClasses = getEmotionColor(emotion)
  const Icon = getEmotionIcon(emotion)

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1.5 font-medium border-2",
        sizeClasses[size],
        colorClasses,
        // Ensure high contrast text on colored backgrounds
        "text-current dark:text-current",
        className
      )}
      role="status"
      aria-label={`${label} emotion`}
    >
      {/* Visual indicator (icon or emoji) */}
      {showIcon && <Icon className="w-3 h-3 flex-shrink-0" aria-hidden="true" />}
      {showEmoji && !showIcon && <span className="text-sm flex-shrink-0" aria-hidden="true">{emoji}</span>}

      {/* Text label for screen readers and accessibility */}
      {showLabel && (
        <span className="font-semibold">
          {label}
        </span>
      )}

      {/* Hidden text for screen readers */}
      <span className="sr-only">
        Student is feeling {label.toLowerCase()}
      </span>
    </Badge>
  )
}

