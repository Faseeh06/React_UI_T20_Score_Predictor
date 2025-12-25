"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Users,
  Download,
  FileText,
  BarChart3,
  Target,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts"
import { format } from "date-fns"
import { generateEmotionTimeline } from "@/lib/emotionSimulator"
import { EmotionDataPoint } from "@/types/emotion"

export default function AnalyticsPage() {
  const [sessionData, setSessionData] = useState({
    duration: 87, // minutes
    averageEngagement: 72,
    peakConfusionMoment: { time: new Date(Date.now() - 30 * 60 * 1000), percentage: 43 },
    interventionsTriggered: 5,
    attendanceRate: 94.5
  })

  const [emotionTimeline, setEmotionTimeline] = useState<EmotionDataPoint[]>([])
  const [studentPerformance] = useState([
    { name: 'Alex Chen', engagement: 85, dominantEmotion: 'engaged', concerns: false },
    { name: 'Jordan Kim', engagement: 78, dominantEmotion: 'happy', concerns: false },
    { name: 'Sam Taylor', engagement: 65, dominantEmotion: 'neutral', concerns: false },
    { name: 'Morgan Lee', engagement: 45, dominantEmotion: 'confused', concerns: true },
    { name: 'Casey Brown', engagement: 82, dominantEmotion: 'engaged', concerns: false },
    { name: 'Riley Davis', engagement: 70, dominantEmotion: 'neutral', concerns: false },
    { name: 'Quinn Martinez', engagement: 55, dominantEmotion: 'bored', concerns: true },
    { name: 'Avery Wilson', engagement: 88, dominantEmotion: 'engaged', concerns: false },
    { name: 'Blake Anderson', engagement: 72, dominantEmotion: 'happy', concerns: false },
    { name: 'Cameron Thomas', engagement: 60, dominantEmotion: 'neutral', concerns: false },
  ])

  useEffect(() => {
    const timeline = generateEmotionTimeline([])
    setEmotionTimeline(timeline)
  }, [])

  const summaryCards = [
    {
      icon: Clock,
      label: 'Total Duration',
      value: `${sessionData.duration} min`,
      color: 'text-blue-500'
    },
    {
      icon: TrendingUp,
      label: 'Avg Engagement',
      value: `${sessionData.averageEngagement}%`,
      color: 'text-green-500'
    },
    {
      icon: AlertTriangle,
      label: 'Peak Confusion',
      value: `${sessionData.peakConfusionMoment.percentage}%`,
      color: 'text-orange-500'
    },
    {
      icon: Target,
      label: 'Interventions',
      value: `${sessionData.interventionsTriggered}`,
      color: 'text-purple-500'
    },
    {
      icon: Users,
      label: 'Attendance Rate',
      value: `${sessionData.attendanceRate}%`,
      color: 'text-indigo-500'
    }
  ]

  // Format chart data
  const chartData = emotionTimeline.map(point => ({
    time: format(point.timestamp, 'HH:mm'),
    timestamp: point.timestamp.getTime(),
    Happy: point.happy,
    Engaged: point.engaged,
    Neutral: point.neutral,
    Confused: point.confused,
    Bored: point.bored,
    Frustrated: point.frustrated
  }))

  const topicAnalysis = [
    { topic: 'Introduction to AI', confusion: 15, engagement: 85 },
    { topic: 'Machine Learning Basics', confusion: 25, engagement: 78 },
    { topic: 'Neural Networks', confusion: 43, engagement: 65 },
    { topic: 'Deep Learning', confusion: 30, engagement: 72 },
    { topic: 'Applications', confusion: 10, engagement: 90 }
  ]

  const handleExportPDF = () => {
    toast.success("PDF export started", {
      description: "Your report will download shortly"
    })
  }

  const handleExportCSV = () => {
    toast.success("CSV export started", {
      description: "Your data will download shortly"
    })
  }

  return (
    <div className="relative min-h-screen w-full bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/instructor" className="font-mono text-xs text-muted-foreground hover:text-foreground">
              ← Back to Dashboard
            </Link>
            <div>
              <h1 className="font-sans text-xl font-medium">Session Analytics</h1>
              <p className="font-mono text-xs text-muted-foreground mt-1">
                CS101 - Introduction to AI • {format(new Date(), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Session Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {summaryCards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <p className="font-mono text-xs text-muted-foreground mb-1">{card.label}</p>
                  <p className="font-sans text-2xl font-light">{card.value}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Complete Emotion Timeline */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-mono text-xs tracking-wider text-muted-foreground mb-2">
                COMPLETE EMOTION TIMELINE
              </h3>
              <p className="font-sans text-2xl font-light">Session Overview</p>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              Full Session
            </Badge>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="happyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="engagedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="confusedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F97316" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="time"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  fontFamily="monospace"
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  fontFamily="monospace"
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontFamily: "monospace",
                    fontSize: "12px",
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
                  iconType="line"
                />
                <Area
                  type="monotone"
                  dataKey="Happy"
                  stackId="1"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.8}
                />
                <Area
                  type="monotone"
                  dataKey="Engaged"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.8}
                />
                <Area
                  type="monotone"
                  dataKey="Neutral"
                  stackId="1"
                  stroke="#ea580c"
                  fill="#ea580c"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="Confused"
                  stackId="1"
                  stroke="#9333ea"
                  fill="#9333ea"
                  fillOpacity={0.7}
                />
                <Area
                  type="monotone"
                  dataKey="Bored"
                  stackId="1"
                  stroke="#64748b"
                  fill="#64748b"
                  fillOpacity={0.5}
                />
                <Area
                  type="monotone"
                  dataKey="Frustrated"
                  stackId="1"
                  stroke="#dc2626"
                  fill="#dc2626"
                  fillOpacity={0.9}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Performance Grid */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-mono text-xs tracking-wider text-muted-foreground mb-2">
                  STUDENT PERFORMANCE
                </h3>
                <p className="font-sans text-xl font-light">Individual Metrics</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {studentPerformance.length} Students
              </Badge>
            </div>
            <div className="space-y-3">
              {studentPerformance.map((student, index) => (
                <motion.div
                  key={student.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="p-4 rounded-lg border border-border/50 bg-muted/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-xs font-mono font-semibold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-sans text-sm font-medium">{student.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {student.dominantEmotion}
                          </Badge>
                          {student.concerns && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                              Flagged
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold">{student.engagement}%</p>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                    </div>
                  </div>
                  <Progress value={student.engagement} className="h-1.5 mt-2" />
                  {student.concerns && (
                    <p className="text-xs text-orange-500 mt-2 font-mono">
                      Recommended: Follow-up session or additional resources
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Content Analysis */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-mono text-xs tracking-wider text-muted-foreground mb-2">
                  CONTENT ANALYSIS
                </h3>
                <p className="font-sans text-xl font-light">Topic Performance</p>
              </div>
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {topicAnalysis.map((topic, index) => (
                <div key={topic.topic} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-sans font-medium">{topic.topic}</span>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-mono text-xs text-muted-foreground">Confusion: </span>
                        <span className="font-mono text-sm font-semibold text-orange-500">
                          {topic.confusion}%
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs text-muted-foreground">Engagement: </span>
                        <span className="font-mono text-sm font-semibold text-green-500">
                          {topic.engagement}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-20">Confusion</span>
                      <Progress value={topic.confusion} className="h-1.5 flex-1" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-20">Engagement</span>
                      <Progress value={topic.engagement} className="h-1.5 flex-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="font-mono text-xs tracking-wider text-muted-foreground mb-3">
                RECOMMENDATIONS
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-3 rounded-lg border border-border/50 bg-muted/30">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="font-mono text-xs">
                    <strong>Neural Networks:</strong> Consider adding more visual examples and interactive demos
                  </p>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg border border-border/50 bg-muted/30">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="font-mono text-xs">
                    <strong>Deep Learning:</strong> Break down complex concepts into smaller segments
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

