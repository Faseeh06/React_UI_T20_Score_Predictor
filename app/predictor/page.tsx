"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Trophy,
    Activity,
    BarChart3,
    Settings2,
    Signal,
    Info,
    ChevronRight,
    RefreshCw,
    Search,
    Calendar,
    MapPin,
    Users,
    AlertTriangle,
    TrendingUp,
    Gauge,
    ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area
} from "recharts"

const teams = [
    "Australia", "Bangladesh", "England", "India",
    "New Zealand", "Pakistan", "South Africa", "Sri Lanka",
    "West Indies", "Afghanistan", "Ireland", "Zimbabwe"
]

const cities = [
    "Auckland", "Bristol", "Colombo", "Dubai",
    "Johannesburg", "Mirpur", "Mumbai", "Southampton",
    "London", "Melbourne", "Sydney", "Cape Town"
]

const models = [
    { id: "catboost", name: "CatBoost", color: "#3B82F6" },
    { id: "rf", name: "Random Forest", color: "#10B981" },
    { id: "xgboost", name: "XGBoost", color: "#F59E0B" },
    { id: "lgbm", name: "LightGBM", color: "#8B5CF6" },
    { id: "lasso", name: "Lasso Reg", color: "#EC4899" }
]

import { toast } from "sonner"

export default function PredictorPage() {
    const [loading, setLoading] = useState(false)
    const [predicting, setPredicting] = useState(false)
    const [fetchingLive, setFetchingLive] = useState(false)
    const [predictions, setPredictions] = useState<null | any>(null)

    // Form State
    const [battingTeam, setBattingTeam] = useState("India")
    const [bowlingTeam, setBowlingTeam] = useState("Australia")
    const [city, setCity] = useState("Mumbai")
    const [currentScore, setCurrentScore] = useState(100)
    const [overs, setOvers] = useState(10)
    const [wickets, setWickets] = useState(2)
    const [batsmenLeft, setBatsmenLeft] = useState(6)
    const [runsLast5, setRunsLast5] = useState(40)

    const handlePredict = () => {
        setPredicting(true)
        // Simulate prediction calculation
        setTimeout(() => {
            const baseScore = currentScore + (20 - overs) * (currentScore / Math.max(overs, 1))
            const results = models.map(m => {
                let bias = 0
                if (m.id === 'catboost') bias = 5
                if (m.id === 'rf') bias = -3
                if (m.id === 'xgboost') bias = 2
                if (m.id === 'lgbm') bias = -1
                if (m.id === 'lasso') bias = -8

                return {
                    ...m,
                    prediction: Math.round(baseScore + bias + (Math.random() * 6 - 3))
                }
            })

            setPredictions({
                avg: Math.round(results.reduce((a, b) => a + b.prediction, 0) / results.length),
                models: results,
                min: Math.min(...results.map(r => r.prediction)),
                max: Math.max(...results.map(r => r.prediction)),
                quantileLow: Math.round(baseScore - 12),
                quantileHigh: Math.round(baseScore + 18)
            })
            setPredicting(false)
        }, 1500)
    }

    const fetchLiveMatch = async () => {
        setFetchingLive(true)
        try {
            const response = await fetch("/api/live-match")
            const data = await response.json()

            if (data.found) {
                if (data.supported) {
                    setBattingTeam(data.batting_team)
                    setBowlingTeam(data.bowling_team)
                    setCity(data.city)
                    setCurrentScore(data.current_score)
                    setOvers(data.overs_completed)
                    setWickets(data.wickets_fallen)
                    setBatsmenLeft(data.batsmen_left)
                    setRunsLast5(data.runs_last_5)
                    toast.success(`Synced: ${data.match_name}`, {
                        description: `Live data for ${data.batting_team} vs ${data.bowling_team} loaded.`
                    })
                } else {
                    toast.error("Format Not Supported", {
                        description: data.message || "We don't have historical data for these teams yet."
                    })
                }
            } else {
                toast.info("No Active Matches", {
                    description: data.message || "There are no live T20 matches currently happening."
                })
            }
        } catch (error) {
            console.error("Failed to fetch live match", error)
            toast.error("Connection Error", {
                description: "Failed to reach the live match API."
            })
        } finally {
            setFetchingLive(false)
        }
    }

    return (
        <div className="relative min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar - Control Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full lg:w-[400px] space-y-6"
                    >
                        <Card className="p-6 border-border bg-card shadow-xl">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <Settings2 className="w-5 h-5 text-primary" />
                                    <h2 className="font-sans text-xl font-light tracking-tight">Match Parameters</h2>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={fetchLiveMatch}
                                    disabled={fetchingLive}
                                    className="text-primary hover:text-primary/80 hover:bg-primary/10 gap-2"
                                >
                                    <Signal className={`w-4 h-4 ${fetchingLive ? 'animate-pulse' : ''}`} />
                                    {fetchingLive ? "Syncing..." : "Live Sync"}
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">Batting Team</Label>
                                        <Select value={battingTeam} onValueChange={setBattingTeam}>
                                            <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm h-11">
                                                <SelectValue placeholder="Select team" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {teams.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">Bowling Team</Label>
                                        <Select value={bowlingTeam} onValueChange={setBowlingTeam}>
                                            <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm h-11">
                                                <SelectValue placeholder="Select team" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {teams.filter(t => t !== battingTeam).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">Venue / City</Label>
                                        <Select value={city} onValueChange={setCity}>
                                            <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm h-11">
                                                <SelectValue placeholder="Select city" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">Current Score</Label>
                                        <Input
                                            type="number"
                                            value={currentScore}
                                            onChange={(e) => setCurrentScore(Number(e.target.value))}
                                            className="bg-card/50 border-border/50 backdrop-blur-sm h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">Overs Done</Label>
                                        <Input
                                            type="number"
                                            value={overs}
                                            onChange={(e) => setOvers(Number(e.target.value))}
                                            className="bg-card/50 border-border/50 backdrop-blur-sm h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">Wickets Down</Label>
                                        <Input
                                            type="number"
                                            value={wickets}
                                            onChange={(e) => setWickets(Number(e.target.value))}
                                            className="bg-card/50 border-border/50 backdrop-blur-sm h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">Batsmen Left</Label>
                                        <Input
                                            type="number"
                                            value={batsmenLeft}
                                            onChange={(e) => setBatsmenLeft(Number(e.target.value))}
                                            className="bg-card/50 border-border/50 backdrop-blur-sm h-11"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">Runs in Last 5 Overs</Label>
                                    <Input
                                        type="number"
                                        value={runsLast5}
                                        onChange={(e) => setRunsLast5(Number(e.target.value))}
                                        className="bg-muted/50 border-border h-11"
                                    />
                                </div>

                                <Button
                                    onClick={handlePredict}
                                    disabled={predicting}
                                    className="w-full h-14 rounded-full border border-primary bg-primary text-primary-foreground hover:bg-transparent hover:text-primary font-mono tracking-widest text-sm transition-all duration-500 mt-4 group"
                                >
                                    {predicting ? (
                                        <div className="flex items-center gap-2">
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            CALCULATING...
                                        </div>
                                    ) : (
                                        <>
                                            GENERATE PREDICTION
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-4 border-primary/20 bg-primary/5 backdrop-blur-xl">
                            <div className="flex gap-4">
                                <div className="p-2 rounded-lg bg-primary/10 h-fit">
                                    <Info className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-light mb-1 uppercase tracking-wider">How it works?</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Our ensemble engine processed the current match trajectory against 15 years of historical score patterns to estimate the final total.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Main Content - Dashboard */}
                    <div className="flex-1 space-y-8">

                        {/* Real-time Match Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-2xl p-8 rounded-3xl shadow-xl">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Trophy className="w-48 h-48 -mr-12 -mt-12" />
                                </div>

                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <div className="w-20 h-20 rounded-full bg-background/50 border border-border flex items-center justify-center mb-3">
                                                <Users className="w-8 h-8 text-primary" />
                                            </div>
                                            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{battingTeam}</div>
                                        </div>
                                        <div className="text-4xl font-light tracking-tighter text-muted-foreground/30 italic">VS</div>
                                        <div className="text-center">
                                            <div className="w-20 h-20 rounded-full bg-background/50 border border-border flex items-center justify-center mb-3">
                                                <Users className="w-8 h-8 text-chart-4" />
                                            </div>
                                            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{bowlingTeam}</div>
                                        </div>
                                    </div>

                                    <div className="h-20 w-px bg-border hidden md:block" />

                                    <div className="text-center md:text-left">
                                        <div className="flex items-baseline gap-2 mb-1 justify-center md:justify-start">
                                            <span className="text-6xl font-light tracking-tighter">{currentScore}/{wickets}</span>
                                            <span className="text-2xl text-muted-foreground/60">({overs}.0)</span>
                                        </div>
                                        <div className="flex items-center gap-4 justify-center md:justify-start">
                                            <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary font-mono text-[10px]">
                                                CRR: {(currentScore / Math.max(overs, 1)).toFixed(2)}
                                            </Badge>
                                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-mono uppercase tracking-widest">
                                                <MapPin className="w-3 h-3" />
                                                {city}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center bg-card px-8 py-4 rounded-2xl border border-border shadow-md">
                                        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Target Match</div>
                                        <div className="text-2xl font-light tracking-tight">T20 INTERNATIONAL</div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Predictions Content */}
                        <AnimatePresence mode="wait">
                            {predictions ? (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    {/* Summary Tiles */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        <Card className="p-6 border-border bg-card shadow-lg border-b-2 border-b-primary">
                                            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Average Prediction</div>
                                            <div className="text-4xl font-light text-primary">{predictions.avg.toFixed(1)}</div>
                                            <div className="text-xs text-muted-foreground/60 mt-2">Aggregated from 5 models</div>
                                        </Card>
                                        <Card className="p-6 border-border bg-card shadow-lg">
                                            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Min Estimation</div>
                                            <div className="text-4xl font-bold">{predictions.min.toFixed(0)}</div>
                                            <div className="text-xs text-muted-foreground/60 mt-2">Conservative scenario</div>
                                        </Card>
                                        <Card className="p-6 border-border bg-card shadow-lg">
                                            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Max Estimation</div>
                                            <div className="text-4xl font-bold">{predictions.max.toFixed(0)}</div>
                                            <div className="text-xs text-muted-foreground/60 mt-2">Aggressive scenario</div>
                                        </Card>
                                        <Card className="p-6 border-border bg-card shadow-lg">
                                            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Confidence Range</div>
                                            <div className="text-4xl font-bold text-chart-4">±15</div>
                                            <div className="text-xs text-muted-foreground/60 mt-2">Variance margin</div>
                                        </Card>
                                    </div>

                                    {/* Charts and Tables */}
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                        {/* Bar Chart Comparison */}
                                        <Card className="p-8 border-border bg-card shadow-xl">
                                            <div className="flex items-center justify-between mb-8">
                                                <div>
                                                    <h3 className="text-lg font-light">Model Comparison</h3>
                                                    <p className="text-xs text-muted-foreground font-mono">Performance cross-validation</p>
                                                </div>
                                                <BarChart3 className="w-5 h-5 text-muted-foreground/20" />
                                            </div>

                                            <div className="h-[300px] w-full text-foreground">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={predictions.models} margin={{ left: 20 }}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.1} />
                                                        <XAxis
                                                            dataKey="name"
                                                            stroke="currentColor"
                                                            strokeOpacity={0.4}
                                                            fontSize={10}
                                                            tickLine={false}
                                                            axisLine={false}
                                                        />
                                                        <YAxis
                                                            stroke="currentColor"
                                                            strokeOpacity={0.4}
                                                            fontSize={10}
                                                            tickLine={false}
                                                            axisLine={false}
                                                            domain={[0, 'auto']}
                                                            label={{ value: 'Runs', angle: -90, position: 'insideLeft', style: { fill: 'currentColor', opacity: 0.4, fontSize: 10, fontFamily: 'monospace' } }}
                                                        />
                                                        <Tooltip
                                                            cursor={{ fill: 'currentColor', fillOpacity: 0.05 }}
                                                            content={({ active, payload }) => {
                                                                if (active && payload && payload.length) {
                                                                    return (
                                                                        <div className="bg-popover border border-border p-3 rounded-lg shadow-2xl">
                                                                            <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">{payload[0].payload.name}</p>
                                                                            <p className="text-xl font-bold text-foreground">{Number(payload[0].value).toFixed(1)} <span className="text-sm font-normal text-muted-foreground">runs</span></p>
                                                                        </div>
                                                                    )
                                                                }
                                                                return null
                                                            }}
                                                        />
                                                        <Bar dataKey="prediction" radius={[4, 4, 0, 0]}>
                                                            {predictions.models.map((entry: any, index: number) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </Card>

                                        {/* Risk Analysis Card */}
                                        <Card className="p-8 border-border bg-card shadow-xl overflow-hidden relative">
                                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                                <Gauge className="w-32 h-32" />
                                            </div>

                                            <div className="relative z-10">
                                                <h3 className="text-lg font-light mb-8">Scenario Probabilities</h3>

                                                <div className="space-y-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0">
                                                            <AlertTriangle className="w-8 h-8 text-destructive" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-end mb-2">
                                                                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Worst Case (10%)</span>
                                                                <span className="text-xl font-light">{predictions.quantileLow.toFixed(0)} Runs</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: "20%" }}
                                                                    className="h-full bg-destructive/50"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                                            <TrendingUp className="w-8 h-8 text-primary" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-end mb-2">
                                                                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Expected (80%)</span>
                                                                <span className="text-xl font-light">{predictions.avg.toFixed(0)} Runs</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: "80%" }}
                                                                    className="h-full bg-primary/50"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 rounded-2xl bg-chart-2/10 border border-chart-2/20 flex items-center justify-center shrink-0">
                                                            <Trophy className="w-8 h-8 text-chart-2" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-end mb-2">
                                                                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Best Case (10%)</span>
                                                                <span className="text-xl font-light">{predictions.quantileHigh.toFixed(0)} Runs</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: "95%" }}
                                                                    className="h-full bg-chart-2/50"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border text-[11px] text-muted-foreground italic leading-relaxed">
                                                    Insight: Based on the current CRR of {(currentScore / Math.max(overs, 1)).toFixed(2)} and {wickets} wickets lost, the model suggests an 80% probability of finishing between {predictions.quantileLow.toFixed(0)} and {predictions.quantileHigh.toFixed(0)} runs.
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-32 text-center"
                                >
                                    <div className="w-24 h-24 rounded-full bg-muted border border-border flex items-center justify-center mb-8 animate-pulse">
                                        <Activity className="w-10 h-10 text-muted-foreground/20" />
                                    </div>
                                    <h3 className="text-2xl font-light mb-2">Ready for Analysis</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto">
                                        Adjust match parameters in the control panel and click Generate Prediction to see detailed projections.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </div>
            </div>
        </div>
    )
}
