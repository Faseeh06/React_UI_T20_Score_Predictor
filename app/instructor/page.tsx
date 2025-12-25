"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Settings, 
  Clock, 
  AlertTriangle,
  Coffee,
  Gauge,
  Lightbulb,
  MessageSquare,
  FileText,
  CheckCircle2,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { 
  generateStudents, 
  updateStudentEmotions, 
  calculateClassMetrics,
  generateEmotionTimeline,
  getEmotionEmoji,
  getEmotionLabel
} from "@/lib/emotionSimulator"
import { Student, ClassMetrics, Intervention, Alert } from "@/types/emotion"
import { StudentCard } from "@/components/emotion/StudentCard"
import { EmotionChart } from "@/components/emotion/EmotionChart"
import { EmotionBadge } from "@/components/emotion/EmotionBadge"

export default function InstructorDashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [metrics, setMetrics] = useState<ClassMetrics | null>(null)
  const [sessionStartTime] = useState<Date>(new Date())
  const [sessionDuration, setSessionDuration] = useState(0)
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [emotionTimeline, setEmotionTimeline] = useState<any[]>([])

  // Initialize students
  useEffect(() => {
    const initialStudents = generateStudents(16)
    setStudents(initialStudents)
    setMetrics(calculateClassMetrics(initialStudents))
    setEmotionTimeline(generateEmotionTimeline(initialStudents))
  }, [])

  // Update emotions every 3-5 seconds
  useEffect(() => {
    if (students.length === 0) return

    const interval = setInterval(() => {
      setStudents(prev => {
        const updated = updateStudentEmotions(prev)
        const newMetrics = calculateClassMetrics(updated)
        setMetrics(newMetrics)
        
        // Show alerts
        newMetrics.alerts.forEach(alert => {
          if (!alert.acknowledged) {
            toast[alert.type](alert.message, {
              duration: 5000,
            })
          }
        })
        
        return updated
      })
    }, 3000 + Math.random() * 2000) // 3-5 seconds

    return () => clearInterval(interval)
  }, [students.length])

  // Update session timer
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000)
      setSessionDuration(elapsed)
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionStartTime])

  // Format session duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Handle intervention actions
  const handleIntervention = useCallback((type: Intervention['type']) => {
    const intervention: Intervention = {
      id: `intervention-${Date.now()}`,
      type,
      timestamp: new Date(),
      impact: Math.floor(Math.random() * 20) + 10, // 10-30% improvement
      accepted: Math.floor(Math.random() * 30) + 70 // 70-100% acceptance
    }

    setInterventions(prev => [intervention, ...prev])

    const messages: { [key in Intervention['type']]: string } = {
      'break': 'Break suggested',
      'slow-down': 'Pace slowed down',
      'example': 'Example shown',
      'qa': 'Q&A session started',
      'clarifying-slide': 'Clarifying slide inserted'
    }

    toast.success(`${messages[type]} (${intervention.accepted}% accepted)`, {
      description: `Engagement improved by ${intervention.impact}%`,
    })

    // Simulate improvement in emotions
    setTimeout(() => {
      setStudents(prev => {
        const improved = prev.map(student => {
          if (Math.random() > 0.3) { // 70% chance of improvement
            const emotions: Student['currentEmotion'][] = ['happy', 'engaged', 'neutral']
            return {
              ...student,
              currentEmotion: emotions[Math.floor(Math.random() * emotions.length)],
              confidence: Math.min(100, student.confidence + 5)
            }
          }
          return student
        })
        setMetrics(calculateClassMetrics(improved))
        return improved
      })
    }, 2000)
  }, [])

  const onlineStudents = students.filter(s => s.isOnline)
  const dominantEmotion = metrics 
    ? Object.entries(metrics.emotionDistribution)
        .sort(([, a], [, b]) => b - a)[0][0] as any
    : 'neutral'

  return (
    <div className="relative min-h-screen w-full bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/select-role" className="font-mono text-xs text-muted-foreground hover:text-foreground">
              ← Back
            </Link>
            <div>
              <h1 className="font-sans text-xl font-medium">CS101 - Introduction to AI</h1>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="font-mono text-xs text-green-500">Live Session</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-sm">{formatDuration(sessionDuration)}</span>
                </div>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Left Panel - Class Overview */}
        <div className="lg:col-span-3 space-y-6">
          {/* Class Stats */}
          <Card className="p-6">
            <h3 className="font-mono text-xs tracking-wider text-muted-foreground mb-4">
              CLASS OVERVIEW
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm text-muted-foreground">Students Online</span>
                  <span className="font-mono text-lg font-semibold">
                    {metrics?.onlineStudents || 0}/{metrics?.totalStudents || 0}
                  </span>
                </div>
                <Progress 
                  value={metrics ? (metrics.onlineStudents / metrics.totalStudents) * 100 : 0} 
                  className="h-2"
                />
              </div>

              <div className="pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-4xl mb-2">{getEmotionEmoji(dominantEmotion)}</div>
                  <p className="font-mono text-xs text-muted-foreground mb-1">Overall Mood</p>
                  <p className="font-sans text-lg font-medium">{getEmotionLabel(dominantEmotion)}</p>
                  <div className="mt-3">
                    <EmotionBadge emotion={dominantEmotion} />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm text-muted-foreground">Engagement</span>
                  <span className="font-mono text-lg font-semibold text-accent">
                    {metrics?.overallEngagement || 0}%
                  </span>
                </div>
                <Progress value={metrics?.overallEngagement || 0} className="h-2" />
              </div>
            </div>
          </Card>

          {/* Emotion Distribution */}
          <Card className="p-6">
            <h3 className="font-mono text-xs tracking-wider text-muted-foreground mb-4">
              EMOTION DISTRIBUTION
            </h3>
            <div className="space-y-3">
              {metrics && Object.entries(metrics.emotionDistribution).map(([emotion, count]) => {
                const percentage = metrics.onlineStudents > 0 
                  ? Math.round((count / metrics.onlineStudents) * 100)
                  : 0
                return (
                  <div key={emotion} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span>{getEmotionEmoji(emotion as any)}</span>
                        <span className="font-mono">{getEmotionLabel(emotion as any)}</span>
                      </div>
                      <span className="font-mono">{count} ({percentage}%)</span>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Alerts Panel */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-xs tracking-wider text-muted-foreground">
                RECENT ALERTS
              </h3>
              {metrics && metrics.alerts.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {metrics.alerts.length}
                </Badge>
              )}
            </div>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {metrics && metrics.alerts.length > 0 ? (
                  metrics.alerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-lg border border-border/50 bg-muted/30 text-xs"
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-mono">{alert.message}</p>
                          <p className="text-muted-foreground mt-1">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No alerts
                  </p>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Center Panel - Student Grid */}
        <div className="lg:col-span-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-mono text-xs tracking-wider text-muted-foreground">
                STUDENTS ({onlineStudents.length})
              </h3>
              <Badge variant="outline" className="font-mono text-xs">
                Live Updates
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {onlineStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          </Card>
        </div>

        {/* Right Panel - Controls & Analytics */}
        <div className="lg:col-span-3 space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-mono text-xs tracking-wider text-muted-foreground mb-4">
              QUICK ACTIONS
            </h3>
            <div className="space-y-2">
              {[
                { icon: Coffee, label: 'Suggest Break', type: 'break' as const },
                { icon: Gauge, label: 'Slow Down Pace', type: 'slow-down' as const },
                { icon: Lightbulb, label: 'Show Example', type: 'example' as const },
                { icon: MessageSquare, label: 'Start Q&A Session', type: 'qa' as const },
                { icon: FileText, label: 'Insert Clarifying Slide', type: 'clarifying-slide' as const },
              ].map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.type}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleIntervention(action.type)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {action.label}
                  </Button>
                )
              })}
            </div>
          </Card>

          {/* Emotion Timeline */}
          <Card className="p-6">
            <h3 className="font-mono text-xs tracking-wider text-muted-foreground mb-4">
              EMOTION TIMELINE
            </h3>
            <div className="h-64">
              <EmotionChart data={emotionTimeline} height={256} />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Last 30 minutes
            </p>
          </Card>

          {/* Intervention History */}
          <Card className="p-6">
            <h3 className="font-mono text-xs tracking-wider text-muted-foreground mb-4">
              INTERVENTION HISTORY
            </h3>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {interventions.length > 0 ? (
                  interventions.slice(0, 5).map((intervention) => (
                    <div
                      key={intervention.id}
                      className="p-3 rounded-lg border border-border/50 bg-muted/30 text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-mono font-medium">
                            {intervention.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <p className="text-muted-foreground mt-1">
                            {new Date(intervention.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-500 font-mono">
                            {intervention.accepted}% accepted
                          </p>
                          <p className="text-muted-foreground text-[10px]">
                            +{intervention.impact}% engagement
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No interventions yet
                  </p>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  )
}

