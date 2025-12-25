"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Eye, 
  EyeOff,
  Settings,
  Coffee,
  BookOpen,
  Lightbulb,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { toast } from "sonner"
import { 
  getRandomEmotion,
  getEmotionEmoji,
  getEmotionLabel,
  getEmotionColor,
  generateEmotionTimeline
} from "@/lib/emotionSimulator"
import { Emotion } from "@/types/emotion"
import { EmotionBadge } from "@/components/emotion/EmotionBadge"
import { EmotionChart } from "@/components/emotion/EmotionChart"

export default function StudentView() {
  const [cameraOn, setCameraOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [trackingActive, setTrackingActive] = useState(true)
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('engaged')
  const [confidence, setConfidence] = useState(85)
  const [insightsOpen, setInsightsOpen] = useState(true)
  const [emotionHistory, setEmotionHistory] = useState<any[]>([])

  // Simulate emotion tracking updates
  useEffect(() => {
    if (!trackingActive) return

    const interval = setInterval(() => {
      const newEmotion = getRandomEmotion()
      setCurrentEmotion(newEmotion)
      setConfidence(prev => Math.max(60, Math.min(100, prev + Math.floor(Math.random() * 10) - 5)))
      
      // Add to history
      setEmotionHistory(prev => [
        ...prev.slice(-14), // Keep last 15
        { timestamp: new Date(), emotion: newEmotion, confidence: confidence }
      ])

      // Show notifications based on emotion
      if (newEmotion === 'confused' && Math.random() > 0.7) {
        toast.info("💡 You seem confused. Here's a helpful resource", {
          description: "Review the last slide or ask a question",
          duration: 5000,
        })
      } else if (newEmotion === 'bored' && Math.random() > 0.7) {
        toast.info("📚 Recommended: Review video from last week", {
          duration: 5000,
        })
      }
    }, 4000 + Math.random() * 2000) // 4-6 seconds

    return () => clearInterval(interval)
  }, [trackingActive, confidence])

  // Initialize emotion timeline
  useEffect(() => {
    const timeline = generateEmotionTimeline([])
    setEmotionHistory(timeline.map((point, i) => ({
      timestamp: point.timestamp,
      emotion: Object.entries(point).find(([key]) => 
        ['happy', 'engaged', 'neutral', 'confused', 'bored', 'frustrated'].includes(key)
      )?.[0] || 'neutral',
      confidence: 70 + Math.random() * 30
    })))
  }, [])

  const handleCameraToggle = () => {
    setCameraOn(!cameraOn)
    toast.info(`Camera ${!cameraOn ? 'enabled' : 'disabled'}`)
  }

  const handleMicToggle = () => {
    setMicOn(!micOn)
    toast.info(`Microphone ${!micOn ? 'enabled' : 'disabled'}`)
  }

  const handleTrackingToggle = () => {
    setTrackingActive(!trackingActive)
    toast.info(`Emotion tracking ${!trackingActive ? 'enabled' : 'paused'}`)
  }

  // Simulate instructor break notification
  useEffect(() => {
    const breakTimer = setTimeout(() => {
      if (Math.random() > 0.5) {
        toast.success("☕ Break suggested by instructor - Take 5 minutes", {
          duration: 8000,
        })
      }
    }, 30000) // After 30 seconds

    return () => clearTimeout(breakTimer)
  }, [])

  const engagementScore = emotionHistory.length > 0
    ? Math.round(
        emotionHistory
          .filter(e => ['happy', 'engaged'].includes(e.emotion))
          .length / emotionHistory.length * 100
      )
    : 75

  return (
    <div className="relative min-h-screen w-full bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/select-role" className="font-mono text-xs text-muted-foreground hover:text-foreground">
              ← Back
            </Link>
            <div>
              <h1 className="font-sans text-xl font-medium">CS101 - Introduction to AI</h1>
              <p className="font-mono text-xs text-muted-foreground mt-1">Student View</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {trackingActive && (
              <Badge variant="outline" className="font-mono text-xs border-green-500/50 text-green-500">
                <Eye className="w-3 h-3 mr-1" />
                Tracking Active
              </Badge>
            )}
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Video Conference Mockup */}
          <Card className="relative aspect-video bg-gradient-to-br from-muted/50 to-muted/20 border-2 border-border/50 overflow-hidden">
            {/* Instructor Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Video className="w-24 h-24 text-muted-foreground/30 mx-auto mb-4" />
                <p className="font-mono text-sm text-muted-foreground">Instructor Video</p>
                <p className="font-mono text-xs text-muted-foreground/50 mt-2">
                  CS101 - Introduction to AI
                </p>
              </div>
            </div>

            {/* Self View Camera (Corner) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-4 right-4 w-32 h-24 rounded-lg border-2 border-border bg-card overflow-hidden"
            >
              {cameraOn ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-accent/20 mx-auto mb-1" />
                    <p className="text-[10px] font-mono text-muted-foreground">You</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <VideoOff className="w-6 h-6 text-muted-foreground" />
                </div>
              )}

              {/* Emotion Tracking Indicator */}
              {trackingActive && cameraOn && (
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 border-2 border-green-500/50 rounded-lg pointer-events-none"
                />
              )}
            </motion.div>

            {/* Slide Counter */}
            <div className="absolute top-4 left-4">
              <Badge variant="outline" className="font-mono text-xs bg-background/80 backdrop-blur-sm">
                Slide 12 of 45
              </Badge>
            </div>
          </Card>

          {/* Class Content Area */}
          <Card className="p-8">
            <div className="aspect-video bg-muted/30 rounded-lg border border-border/50 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="font-mono text-sm text-muted-foreground">Presentation Slide</p>
                <p className="font-mono text-xs text-muted-foreground/50 mt-2">
                  Topic: Neural Networks and Deep Learning
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar - Personal Insights */}
        <div className="lg:col-span-1">
          <Collapsible open={insightsOpen} onOpenChange={setInsightsOpen}>
            <Card className="p-6">
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mono text-xs tracking-wider text-muted-foreground">
                    YOUR CURRENT STATE
                  </h3>
                  {insightsOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="space-y-6">
                  {/* Current Emotion */}
                  <div className="text-center pt-4 border-t border-border">
                    <div className="text-5xl mb-3">{getEmotionEmoji(currentEmotion)}</div>
                    <EmotionBadge emotion={currentEmotion} className="mx-auto" />
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="font-mono">{confidence}%</span>
                      </div>
                      <Progress value={confidence} className="h-2" />
                    </div>
                  </div>

                  {/* Engagement Timeline */}
                  <div className="pt-4 border-t border-border">
                    <h4 className="font-mono text-xs text-muted-foreground mb-3">
                      Your Engagement (Last 15 min)
                    </h4>
                    <div className="h-32">
                      <EmotionChart 
                        data={emotionHistory.slice(-15).map(e => ({
                          timestamp: e.timestamp,
                          happy: e.emotion === 'happy' ? 1 : 0,
                          engaged: e.emotion === 'engaged' ? 1 : 0,
                          neutral: e.emotion === 'neutral' ? 1 : 0,
                          confused: e.emotion === 'confused' ? 1 : 0,
                          bored: e.emotion === 'bored' ? 1 : 0,
                          frustrated: e.emotion === 'frustrated' ? 1 : 0,
                        }))} 
                        height={128}
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <p className="font-mono text-xs text-muted-foreground">
                        Engagement Score: <span className="text-foreground font-semibold">{engagementScore}%</span>
                      </p>
                    </div>
                  </div>

                  {/* Personalized Recommendations */}
                  {(currentEmotion === 'confused' || currentEmotion === 'frustrated' || currentEmotion === 'bored') && (
                    <div className="pt-4 border-t border-border">
                      <div className="p-4 rounded-lg border border-orange-500/50 bg-orange-500/10">
                        <div className="flex items-start gap-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5" />
                          <h4 className="font-mono text-xs font-semibold">Recommendation</h4>
                        </div>
                        <p className="font-mono text-xs text-muted-foreground">
                          {currentEmotion === 'confused' && "Consider reviewing the previous slides or asking a question"}
                          {currentEmotion === 'frustrated' && "Take a moment to breathe. You can pause and review materials"}
                          {currentEmotion === 'bored' && "Try engaging more actively or take a short break"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      </div>

      {/* Privacy Controls Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-background/80 backdrop-blur-sm p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant={cameraOn ? "default" : "outline"}
              size="sm"
              onClick={handleCameraToggle}
            >
              {cameraOn ? <Video className="w-4 h-4 mr-2" /> : <VideoOff className="w-4 h-4 mr-2" />}
              Camera
            </Button>
            <Button
              variant={micOn ? "default" : "outline"}
              size="sm"
              onClick={handleMicToggle}
            >
              {micOn ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
              Microphone
            </Button>
            <Button
              variant={trackingActive ? "default" : "outline"}
              size="sm"
              onClick={handleTrackingToggle}
              className={trackingActive ? "border-green-500" : ""}
            >
              {trackingActive ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
              {trackingActive ? "Tracking Active" : "Pause Tracking"}
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Privacy Settings
          </Button>
        </div>
      </div>

      {/* Spacer for fixed bottom bar */}
      <div className="h-20" />
    </div>
  )
}

