import { NextRequest, NextResponse } from "next/server"

const SUPPORTED_TEAMS = [
    "Australia", "Bangladesh", "England", "India",
    "New Zealand", "Pakistan", "South Africa", "Sri Lanka",
    "West Indies", "Afghanistan", "Ireland", "Zimbabwe"
]

export async function GET(req: NextRequest) {
    const cricApiKey = process.env.CRICAPI_KEY

    if (!cricApiKey) {
        return NextResponse.json({ found: false, error: "CricAPI key not configured" })
    }

    try {
        // 1. Fetch current matches
        const response = await fetch(`https://api.cricapi.com/v1/currentMatches?apikey=${cricApiKey}&offset=0`)
        const result = await response.json()

        if (result.status !== "success") {
            throw new Error(result.reason || "CricAPI fetch failed")
        }

        // 2. Find any T20 match that is live
        const anyT20Match = result.data.find((match: any) => match.matchType === "t20" && !match.matchEnded)

        if (!anyT20Match) {
            return NextResponse.json({
                found: false,
                message: "No live T20 matches currently available."
            })
        }

        // 3. Check for support
        const teamsInMatch = anyT20Match.teams || []
        const isSupported = teamsInMatch.every((t: string) =>
            SUPPORTED_TEAMS.some(st => t.toLowerCase().includes(st.toLowerCase()))
        )

        if (!isSupported) {
            return NextResponse.json({
                found: true,
                supported: false,
                match_name: `${anyT20Match.teams[0]} vs ${anyT20Match.teams[1]}`,
                message: `Found ${anyT20Match.teams[0]} vs ${anyT20Match.teams[1]}, but these teams are not yet in our historical database.`
            })
        }

        // 4. Extract Score Details for Supported Match
        const scores = anyT20Match.score || []
        const currentScoreData = scores.length > 0 ? scores[scores.length - 1] : {}

        return NextResponse.json({
            found: true,
            supported: true,
            match_name: `${anyT20Match.teams[0]} vs ${anyT20Match.teams[1]}`,
            batting_team: SUPPORTED_TEAMS.find(st => currentScoreData.inning?.toLowerCase().includes(st.toLowerCase())) || anyT20Match.teams[0],
            bowling_team: anyT20Match.teams.find((t: string) => !currentScoreData.inning?.toLowerCase().includes(t.toLowerCase())) || anyT20Match.teams[1],
            city: anyT20Match.venue?.split(',')[0] || "Unknown",
            current_score: currentScoreData.r || 0,
            overs_completed: Math.floor(currentScoreData.o || 0),
            wickets_fallen: currentScoreData.w || 0,
            batsmen_left: 10 - (currentScoreData.w || 0),
            runs_last_5: Math.round((currentScoreData.r || 0) * 0.15)
        })

    } catch (error: any) {
        console.error("Live match fetch error:", error)
        return NextResponse.json({ found: false, error: error.message }, { status: 500 })
    }
}
