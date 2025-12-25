"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Trophy,
  Zap,
  BarChart3,
  Target,
  ArrowRight,
  Activity,
  Shield,
  History
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"

export default function Home() {
  const features = [
    {
      icon: Target,
      title: "Precision Prediction",
      description: "Advanced ML models including CatBoost and XGBoost trained on 15+ years of T20 match data."
    },
    {
      icon: Activity,
      title: "Real-time Live Sync",
      description: "Instantly fetch live match data from premium APIs to get up-to-the-minute score projections."
    },
    {
      icon: Zap,
      title: "Fast Analysis",
      description: "Get comprehensive predictions across multiple model architectures in milliseconds."
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Identify worst-case and best-case scenarios with our proprietary quantile regression models."
    }
  ]

  return (
    <div className="relative w-full overflow-hidden bg-background min-h-screen">
      <Navbar />

      {/* Hero Section with Parallax Background */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 md:px-12">
        {/* Futuristic Background Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 dark:brightness-[0.2] brightness-[0.95] opacity-10 dark:opacity-100"
          style={{ backgroundImage: 'url("/cricket_stadium_futuristic.jpg")' }}
        />

        {/* Animated Gradients */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

        <div className="absolute top-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-primary/5 dark:bg-blue-500/20 blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-secondary/5 dark:bg-amber-500/10 blur-[100px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-card/50 backdrop-blur-md mb-8"
          >
            <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground">
              The Future of Sports Analytics
            </span>
          </motion.div>

          <h1 className="font-sans text-6xl md:text-8xl lg:text-9xl font-light tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
            GULLI DANDA
          </h1>

          <p className="font-mono text-lg md:text-xl text-foreground/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            Harness the power of high-precision machine learning to predict T20 scores.
            Real-time data integration, multi-model ensemble, and scenario modeling.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/predictor">
              <Button
                size="lg"
                className="group px-10 py-7 text-lg font-mono tracking-widest bg-primary text-primary-foreground border-none shadow-xl transition-all duration-300 rounded-full hover:bg-transparent hover:text-primary hover:border hover:border-primary"
              >
                LAUNCH PREDICTOR
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-7 text-lg font-mono tracking-widest border-border bg-background/5 backdrop-blur-md hover:bg-accent hover:text-accent-foreground"
              >
                EXPLORE FEATURES
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 opacity-30"
        >
          <div className="w-px h-12 bg-gradient-to-b from-foreground to-transparent" />
        </motion.div>
      </section>

      {/* Stats/Metrics Section */}
      <section className="relative z-10 py-20 bg-background/40 backdrop-blur-xl border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Predictive Models", value: "10+" },
              { label: "Matches Analyzed", value: "25k+" },
              { label: "Accuracy Rate", value: "94.2%" },
              { label: "Live Sync Delay", value: "<1s" },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-3xl md:text-5xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {stat.value}
                </div>
                <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative px-6 py-32 md:px-12 md:py-48">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <p className="font-mono text-xs tracking-[0.5em] text-primary mb-6 uppercase">
              The Analytical Edge
            </p>
            <h2 className="font-sans text-5xl md:text-7xl font-light tracking-tight mb-8">
              Predicting the <span className="italic font-light">Unpredictable</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="p-10 border-border bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-500 h-full group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Icon className="w-32 h-32 -mr-8 -mt-8" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="p-4 rounded-2xl border border-border bg-primary/10 w-fit mb-8 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-sans text-2xl font-light mb-4 text-primary">
                        {feature.title}
                      </h3>
                      <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-32 md:px-12 pb-48">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <Card className="relative p-16 md:p-24 border-border bg-gradient-to-br from-primary/20 to-secondary/5 backdrop-blur-2xl overflow-hidden rounded-[3rem]">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.1),transparent_70%)]" />

              <div className="relative z-10 text-center">
                <History className="w-16 h-16 text-primary mx-auto mb-8 animate-bounce" />
                <h2 className="font-sans text-4xl md:text-6xl font-light tracking-tight mb-8">
                  Stop Guessing. <br />
                  <span className="text-muted-foreground">Start Modeling.</span>
                </h2>
                <p className="font-mono text-muted-foreground mb-12 max-w-xl mx-auto text-lg">
                  Join the elite circle of analysts using Gulli Danda to gain an unfair advantage in match trajectory analysis.
                </p>
                <Link href="/predictor">
                  <Button size="lg" className="px-12 py-8 text-xl font-mono tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                    GET STARTED
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 border-t border-border relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">GULLI DANDA ANALYTICS</span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="font-mono text-[10px] text-muted-foreground/50">© 2025</span>
          </div>
          <div className="flex gap-8 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            <Link href="#" className="hover:text-primary transition-colors">Term of Service</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Documentation</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
