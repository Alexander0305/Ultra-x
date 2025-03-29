import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export type UserInterest = {
  category: string
  score: number
}

export type ContentRecommendation = {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  relevanceScore: number
  source?: string
  url?: string
}

export async function generateRecommendations(
  userInterests: UserInterest[],
  recentActivity: string[],
  count = 5,
): Promise<ContentRecommendation[]> {
  try {
    // Create a prompt for the AI to generate recommendations
    const interestsString = userInterests
      .map((interest) => `${interest.category} (score: ${interest.score})`)
      .join(", ")

    const activityString = recentActivity.join(", ")

    const prompt = `
      Generate ${count} content recommendations for a user with the following interests:
      ${interestsString}
      
      Recent user activity includes:
      ${activityString}
      
      For each recommendation, provide:
      1. A compelling title
      2. A brief description (1-2 sentences)
      3. The primary category
      4. 3-5 relevant tags
      5. A relevance score from 0.1 to 1.0 based on how well it matches the user's interests
      
      Format the response as a valid JSON array of objects with the properties: id, title, description, category, tags, and relevanceScore.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    // Parse the response
    const recommendations: ContentRecommendation[] = JSON.parse(text)

    // Ensure we have the right number of recommendations
    return recommendations.slice(0, count)
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return []
  }
}

export async function analyzeUserInterests(userActivity: string[]): Promise<UserInterest[]> {
  try {
    const activityString = userActivity.join("\n")

    const prompt = `
      Based on the following user activity, identify the top 5 interest categories and assign a relevance score (0.1 to 1.0) to each:
      
      ${activityString}
      
      Format the response as a valid JSON array of objects with the properties: category and score.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    // Parse the response
    const interests: UserInterest[] = JSON.parse(text)

    return interests
  } catch (error) {
    console.error("Error analyzing user interests:", error)
    return []
  }
}

