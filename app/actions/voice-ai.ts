'use server'

import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function processVoiceCommandAI(
    transcript: string,
    currentPath: string,
    pageContent?: string
): Promise<{
    text: string;
    action?: { type: 'navigate' | 'click' | 'read'; target?: string }
}> {
    try {
        if (!process.env.GROQ_API_KEY) {
            return { text: "I'm sorry, my AI brain (Groq) is not connected. Please check your API key." };
        }

        const systemPrompt = `You are an intelligent accessibility voice assistant for a web application.
Current Context: User is on page "${currentPath}".
Live Page Data: ${pageContent || "No live data provided."}

Your goal is to interpret the user's voice command and return a structured JSON response.

REPORTING CAPABILITY:
When the user asks for a "report", "status", "whats on the page", or "how is the class":
- Provide a natural, spoken summary in exactly 2-3 sentences based ON THE REAL-TIME DATA in "Live Page Data".
- Focus on the LIVE STATISTICS: How many students are online, the overall class mood (Happy, Engaged, etc.), the average engagement score, and a quick mention of the emotion distribution (e.g., 40% happy).
- PROHIBITED: Avoid generic summaries of what the page is for. Instead, give the actual numbers and moods found in the data.
- Example: "Right now, 15 out of 16 students are online with a dominant happy mood. The class engagement is strong at 82 percent, with 40 percent of students feeling engaged and 40 percent feeling happy."
- ONLY return the finished summary in the "text" field of your JSON.

STRICT NAVIGATION MAP (Only route to these paths):
- Home: "/"
- Login: "/login"
- Register: "/signin"
- Student Classroom/Panel: "/student"
- Instructor Panel: "/instructor"
- Analytics: "/analytics"
- Role Selection: "/select-role"

Available Actions:
1. NAVIGATION: "open student panel", "go to instructor dashboard" -> return { "action": { "type": "navigate", "target": "/student" }, "text": "Navigating to Student Panel..." }
2. INTERACTION: "click submit", "press start" -> return { "action": { "type": "click", "target": "submit" }, "text": "Clicking submit" }
3. READING: "read page", "what's on this page?" -> return { "action": { "type": "read" }, "text": "Analyzing the page for you..." }
4. GENERAL/Q&A: "what is this app?", "help me" -> return { "text": "Brief helpful answer..." }

Rules:
- Keep responses concise and spoken-style.
- Return ONLY valid JSON.
- Do not include markdown formatting.
`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: transcript }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.5,
            max_tokens: 150,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content || "{}";

        try {
            return JSON.parse(content);
        } catch (e) {
            // Fallback if model doesn't return JSON
            return { text: content };
        }

    } catch (error) {
        console.error("Groq AI Error:", error);
        return { text: "I'm having trouble connecting to the server." };
    }
}
