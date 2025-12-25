# Gulli Danda: AI-Powered T20 Predictor

> A premium Next.js 16 prototype for T20 cricket score prediction using advanced ensemble machine learning models and real-time match data synchronization.

![Gulli Danda Analytics](public/cricket_stadium_futuristic.jpg)

## 🌟 Overview

Gulli Danda is a state-of-the-art analytical tool designed to provide high-precision score projections for T20 matches. It leverages multiple model architectures (CatBoost, Random Forest, XGBoost) and incorporates live match data to give analysts a definitive edge.

**Key Features:**
- 🎯 **Multi-Model Ensemble**: Predictions from 5+ specialized ML models
- 📡 **Real-time API Sync**: Instant match data integration (CricAPI/SerpAPI)
- 📊 **Scenario Modeling**: Worst-case and best-case score projections
- ⚖️ **Risk Assessment**: Probability-based outcome analysis
- 🎨 **Premium UI/UX**: Theme-aware, data-rich analytical dashboard

## 🚀 Live Demo

The prototype is ready to run locally. See the [Installation](#installation) section below.

## ✨ Features

### Precision Prediction Engine
- **Multiple Architectures**: Trained on CatBoost, Random Forest, and more
- **Confidence Intervals**: 80% probability range calculations
- **Live Trajectory Analysis**: Deep analysis of CRR and wicket patterns

### Advanced Dashboard
- **Real-time Scorecards**: Interactive match status updates
- **Model Comparison**: Side-by-side performance visualization
- **Mobile-First Design**: Fully responsive analytical experience

### Data Integration
- **Live Sync**: One-tap synchronization with live match data
- **Venue Analytics**: Location-based performance modeling (12+ cities)
- **Team Dynamics**: Historical head-to-head patterns

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript

### UI & Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Animation library

### Data Visualization
- **Recharts** - Chart library for predictive trends
- **Responsive Charts** - Mobile-friendly data visualization

## 📁 Project Structure

```
gulli-danda/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes for live sync
│   ├── predictor/               # Prediction dashboard
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles (Theme System)
├── components/                  # Reusable components
│   ├── ui/                      # shadcn/ui components
│   └── navbar.tsx               # Navigation system
├── lib/                         # Utility libraries
│   └── utils.ts                 # General utilities
├── public/                      # Static assets & .pkl models
└── .env.local                   # API Keys (CricAPI, SerpAPI)
```

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup API Keys**
   Add your keys to `.env.local`:
   ```env
   CRICAPI_KEY=your_key_here
   SERPAPI_KEY=your_key_here
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Color Palette
- **Primary**: Deep Indigo Blue (#3B82F6)
- **Dark Background**: Cinematic Slate (#020617)
- **Light Background**: Clean White (#FFFFFF)
- **Accents**: Emerald Green for "Best Case", Rose Red for "Worst Case"

### Animations
- **Cinematic Hero**: Smooth tracking and parallax effects
- **Dashboard Transitions**: AnimatePresence for seamless route changes
- **Micro-interactions**: Subtle hover scales and glassmorphism ripples

---

**Built for the future of cricket analytics.**
