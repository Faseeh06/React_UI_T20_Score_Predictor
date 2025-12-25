"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts"
import { EmotionDataPoint } from "@/types/emotion"
import { format } from "date-fns"

interface EmotionChartProps {
  data: EmotionDataPoint[]
  height?: number
}

export function EmotionChart({ data, height = 300 }: EmotionChartProps) {
  // Format data for Recharts
  const chartData = data.map(point => ({
    time: format(point.timestamp, 'HH:mm'),
    timestamp: point.timestamp.getTime(),
    Happy: point.happy,
    Engaged: point.engaged,
    Neutral: point.neutral,
    Confused: point.confused,
    Bored: point.bored,
    Frustrated: point.frustrated
  }))

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
          <Line
            type="monotone"
            dataKey="Happy"
            stroke="#22c55e"
            strokeWidth={3}
            dot={false}
            strokeDasharray="0"
          />
          <Line
            type="monotone"
            dataKey="Engaged"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="Neutral"
            stroke="#ea580c"
            strokeWidth={3}
            dot={false}
            strokeDasharray="10 5"
          />
          <Line
            type="monotone"
            dataKey="Confused"
            stroke="#9333ea"
            strokeWidth={3}
            dot={false}
            strokeDasharray="15 5 5 5"
          />
          <Line
            type="monotone"
            dataKey="Bored"
            stroke="#64748b"
            strokeWidth={3}
            dot={false}
            strokeDasharray="2 2"
          />
          <Line
            type="monotone"
            dataKey="Frustrated"
            stroke="#dc2626"
            strokeWidth={3}
            dot={false}
            strokeDasharray="8 4 2 4"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

