"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Volume2, X, Sparkles } from "lucide-react"
import { processVoiceCommandAI } from "@/app/actions/voice-ai"

interface VoiceAssistantProps {
    apiKey?: string // Optional API key for Gemini
}

export function VoiceAssistant({ apiKey }: VoiceAssistantProps) {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [response, setResponse] = useState("")
    const [isFlashing, setIsFlashing] = useState(false)

    const router = useRouter()
    const pathname = usePathname()
    const recognitionRef = useRef<any>(null)

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = false
                recognition.interimResults = false
                recognition.lang = "en-US"

                recognition.onstart = () => setIsListening(true)
                recognition.onend = () => setIsListening(false)

                recognition.onresult = (event: any) => {
                    const command = event.results[event.results.length - 1][0].transcript
                    setTranscript(command)
                    processCommand(command)
                }

                recognitionRef.current = recognition
            }
        }
    }, [pathname])

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop()
        } else {
            recognitionRef.current?.start()
            speak("How can I help you?")
        }
    }

    const speak = (text: string) => {
        if (typeof window !== "undefined") {
            window.speechSynthesis.cancel()
            const utterance = new SpeechSynthesisUtterance(text)
            window.speechSynthesis.speak(utterance)
            setResponse(text)
        }
    }

    const processCommand = async (cmd: string) => {
        const lowerCmd = cmd.toLowerCase()

        // Trigger Flash for Analysis commands
        if (lowerCmd.includes("report") || lowerCmd.includes("status") || lowerCmd.includes("what's on") || lowerCmd.includes("feeling")) {
            setIsFlashing(true)
            setTimeout(() => setIsFlashing(false), 150)
        }

        // 1. Basic Navigation
        if (lowerCmd.includes("open") || lowerCmd.includes("go to")) {
            if (lowerCmd.includes("home")) {
                router.push("/")
                speak("Opening home page")
                return
            } else if (lowerCmd.includes("dashboard")) {
                router.push("/select-role")
                speak("Opening role selection page")
                return
            } else if (lowerCmd.includes("login") || lowerCmd.includes("sign")) {
                router.push("/signin")
                speak("Opening registration page")
                return
            }
        }

        // 2. Page Interaction
        if (lowerCmd.includes("read page") || lowerCmd.includes("read content")) {
            const content = document.body.innerText.substring(0, 500)
            speak("Here is the page content. " + content)
            return
        }

        if (lowerCmd.includes("describe page")) {
            const buttons = document.querySelectorAll("button").length
            const links = document.querySelectorAll("a").length
            const inputs = document.querySelectorAll("input").length
            speak(`This page contains ${buttons} buttons, ${links} links, and ${inputs} input fields.`)
            return
        }

        if (lowerCmd.includes("click")) {
            const target = lowerCmd.replace("click", "").trim()
            const elements = Array.from(document.querySelectorAll("button, a, [role='button']"))
            const found = elements.find(el => (el as HTMLElement).innerText.toLowerCase().includes(target) || (el as HTMLElement).getAttribute("aria-label")?.toLowerCase().includes(target))
            if (found) {
                (found as HTMLElement).click()
                speak(`Clicking ${target}`)
            } else {
                speak(`I couldn't find a button named ${target}`)
            }
            return
        }

        // 3. AI Fallback (Groq)
        try {
            // Local feedback for long processing
            setResponse("Analyzing live class data...")

            // Scrape meaningful data - prioritize the main grid/content area
            const mainContent = document.querySelector('div.grid') || document.body
            const cards = Array.from(mainContent.querySelectorAll('div[class*="card"], .Card, .p-6'))
            const pageData = cards
                .map(c => (c as HTMLElement).innerText.trim())
                .filter(text => text.length > 10)
                .join("\n---\n")

            const aiResponse = await processVoiceCommandAI(cmd, pathname, pageData.substring(0, 2500))

            if (aiResponse.text) {
                speak(aiResponse.text)
            } else {
                speak("I've analyzed the page but don't have a specific summary. The class seems to be active.")
            }

            if (aiResponse.action) {
                const { type, target } = aiResponse.action
                if (type === 'navigate' && target) {
                    router.push(target)
                } else if (type === 'click' && target) {
                    const elements = Array.from(document.querySelectorAll("button, a, [role='button']"))
                    const found = elements.find(el =>
                        (el as HTMLElement).innerText.toLowerCase().includes(target.toLowerCase()) ||
                        (el as HTMLElement).getAttribute("aria-label")?.toLowerCase().includes(target.toLowerCase())
                    )
                    if (found) (found as HTMLElement).click()
                } else if (type === 'read') {
                    // For 'read', if we don't have a text response already, we can read a snippet
                    if (!aiResponse.text) {
                        const content = document.body.innerText.substring(0, 300)
                        speak("The page contains: " + content)
                    }
                }
            }
        } catch (error) {
            console.error("AI Error", error)
            speak("I encountered an error processing that command.")
        }
    }

    return (
        <>
            <AnimatePresence>
                {isFlashing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-white pointer-events-none"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                <motion.div
                    drag
                    className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2"
                >
                    {/* Transcript Bubble */}
                    {(transcript || response) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-card border border-border p-4 rounded-xl shadow-lg max-w-xs mb-2 backdrop-blur-md"
                        >
                            {transcript && <p className="text-xs text-muted-foreground font-mono">You: "{transcript}"</p>}
                            {response && <p className="text-sm font-medium mt-1 text-primary">{response}</p>}
                        </motion.div>
                    )}

                    {/* Main Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleListening}
                        className={`h-16 w-16 rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm border transition-all duration-300 ${isListening
                            ? "bg-red-500/80 border-red-400 animate-pulse text-white"
                            : "bg-primary/90 border-primary text-primary-foreground hover:bg-primary"
                            }`}
                    >
                        {isListening ? (
                            <Mic className="h-8 w-8" />
                        ) : (
                            <MicOff className="h-8 w-8" />
                        )}
                    </motion.button>
                </motion.div>
            </AnimatePresence>
        </>
    )
}
