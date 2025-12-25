# Emotion-Aware Virtual Classroom Prototype

A Next.js interactive prototype for an Emotion-Aware Virtual Classroom system that demonstrates real-time emotion tracking, instructor dashboards, and adaptive learning features.

## 🚀 Features

### Pages & Routes

1. **Landing Page (`/`)**
   - Hero section explaining the Emotion-Aware Virtual Classroom
   - Key features overview (4 cards)
   - "Try Demo" button

2. **Role Selection (`/select-role`)**
   - Choose between Instructor Dashboard or Student View
   - Beautiful card-based selection interface

3. **Instructor Dashboard (`/instructor`)**
   - **Top Navigation**: Class name, live indicator, session timer
   - **Left Panel**: Class overview, emotion distribution, alerts
   - **Center Panel**: Student grid with real-time emotion updates
   - **Right Panel**: Quick actions, emotion timeline chart, intervention history
   - Real-time emotion simulation (updates every 3-5 seconds)
   - Alert system with toast notifications
   - Intervention actions with simulated impact

4. **Student View (`/student`)**
   - Video conference mockup with instructor and self-view
   - Emotion tracking indicator with animated ripple effect
   - Personal emotion insights panel (collapsible)
   - Privacy controls (camera, microphone, tracking toggle)
   - Personalized recommendations when struggling detected

5. **Analytics Page (`/analytics`)**
   - Session summary cards
   - Complete emotion timeline (stacked area chart)
   - Student performance grid
   - Content analysis with topic performance
   - Export functionality (PDF/CSV buttons)

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React hooks (useState, useEffect)
- **Notifications**: Sonner (toast)

## 📁 Project Structure

```
app/
├── page.tsx                    # Landing page
├── select-role/
│   └── page.tsx                # Role selection
├── instructor/
│   └── page.tsx                # Instructor dashboard
├── student/
│   └── page.tsx                # Student view
└── analytics/
    └── page.tsx                # Analytics/reports

components/
└── emotion/
    ├── EmotionBadge.tsx        # Emotion badge component
    ├── StudentCard.tsx          # Student card component
    └── EmotionChart.tsx        # Emotion timeline chart

lib/
└── emotionSimulator.ts         # Mock data generation & simulation

types/
└── emotion.ts                  # TypeScript interfaces
```

## 🎨 Key Components

### EmotionBadge
Displays emotion with emoji and label, color-coded by emotion type.

### StudentCard
Shows student avatar, name, current emotion, and confidence level with progress bar.

### EmotionChart
Real-time updating line chart showing emotion trends over time.

## 🔄 Real-Time Simulation

The prototype simulates real-time emotion tracking:

- **Student Emotions**: Update randomly every 3-5 seconds
- **Confidence Levels**: Fluctuate within realistic ranges
- **Class Metrics**: Automatically recalculated on each update
- **Alerts**: Triggered when thresholds are crossed (confusion > 40%, boredom > 30%, etc.)
- **Interventions**: Show simulated impact on student engagement

## 🎯 Emotion Types

- 😊 **Happy** - Green
- 🎯 **Engaged** - Blue  
- 😐 **Neutral** - Yellow
- 😕 **Confused** - Orange
- 😴 **Bored** - Gray
- 😤 **Frustrated** - Red

## 🚦 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## 📝 Usage

1. Start at the **Landing Page** (`/`)
2. Click **"Try Demo"** to go to role selection
3. Choose **Instructor Dashboard** or **Student View**
4. Experience real-time emotion tracking and interactions

### Instructor Dashboard Features:
- Watch student emotions update in real-time
- Click intervention buttons to see simulated improvements
- View alerts when thresholds are crossed
- Check emotion timeline chart
- Review intervention history

### Student View Features:
- Toggle camera, microphone, and emotion tracking
- View personal emotion insights
- See recommendations when struggling
- Experience privacy controls

### Analytics Page:
- View complete session analysis
- See student performance metrics
- Analyze content effectiveness
- Export reports (simulated)

## 🎭 Mock Data

All data is simulated using the `emotionSimulator.ts` library:

- **16 students** with random names
- **Weighted emotion distribution** (more engaged/happy, fewer frustrated)
- **Realistic confidence levels** (60-100%)
- **Historical emotion data** for charts
- **Alert generation** based on thresholds

## 🎨 Design System

- **Colors**: Uses Tailwind CSS with CSS variables
- **Typography**: Mix of sans-serif (headings) and monospace (data)
- **Spacing**: Consistent padding and margins
- **Animations**: Smooth transitions with Framer Motion
- **Responsive**: Mobile-friendly layouts

## 🔧 Customization

### Adjust Emotion Update Frequency
Edit `app/instructor/page.tsx`:
```typescript
const interval = setInterval(() => {
  // Update logic
}, 3000 + Math.random() * 2000) // Change timing here
```

### Modify Alert Thresholds
Edit `lib/emotionSimulator.ts`:
```typescript
if (confusionPercent > 40) { // Change threshold
  // Alert logic
}
```

### Add New Emotions
1. Update `Emotion` type in `types/emotion.ts`
2. Add emoji/color mappings in `lib/emotionSimulator.ts`
3. Update UI components to handle new emotion

## 📊 Charts & Visualizations

- **Line Charts**: Emotion trends over time
- **Area Charts**: Stacked emotion distribution
- **Progress Bars**: Confidence and engagement levels
- **Bar Charts**: Topic performance analysis

## 🎯 Future Enhancements

Potential additions (not implemented):
- Dark mode toggle
- Sound effects for alerts
- Emotion heatmap visualization
- Comparison mode (current vs previous sessions)
- Detailed student profile pages
- A/B test results
- Actual PDF/CSV export functionality
- Settings panel for threshold customization

## 📄 Notes

- This is a **prototype demonstration**
- All data is **simulated** (no real AI/ML)
- No backend/API required
- Perfect for UX/UI demonstration
- Shows interaction design patterns

## 🐛 Troubleshooting

If you encounter issues:

1. **Charts not rendering**: Ensure Recharts is installed
2. **Styles not applying**: Check Tailwind CSS configuration
3. **Animations not working**: Verify Framer Motion installation
4. **Toast notifications**: Ensure Sonner is configured in layout

## 📚 Dependencies

Key dependencies (already in package.json):
- `next`: 16.0.3
- `react`: 19.2.0
- `recharts`: 2.15.4
- `framer-motion`: latest
- `lucide-react`: ^0.454.0
- `tailwindcss`: ^4.1.9
- `sonner`: ^1.7.4

## 🎉 Enjoy!

This prototype demonstrates all key features of an Emotion-Aware Virtual Classroom system. Use it as a foundation for building the real application!

