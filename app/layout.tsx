import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { CustomCursor } from "@/components/custom-cursor"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Gulli Danda | AI Cricket Analytics",
  description: "Next-gen T20 cricket score prediction using advanced ensemble machine learning models.",
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#020617",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <div className="noise-overlay" />
          {children}
          <CustomCursor />
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
