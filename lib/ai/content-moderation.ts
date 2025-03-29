import { OpenAI } from "openai"
import { env } from "@/lib/config"

export enum ContentModerationResult {
  APPROVED = "APPROVED",
  FLAGGED = "FLAGGED",
  REJECTED = "REJECTED",
}

export interface ModerationResponse {
  result: ContentModerationResult
  categories: string[]
  score: number
  explanation?: string
}

// Initialize OpenAI with dynamic API key
async function getOpenAIClient() {
  const apiKey = await env("OPENAI_API_KEY", "")

  if (!apiKey) {
    throw new Error("OpenAI API key is not configured")
  }

  return new OpenAI({
    apiKey,
  })
}

export async function moderateContent(content: string): Promise<ModerationResponse> {
  try {
    const openai = await getOpenAIClient()

    const response = await openai.moderations.create({
      input: content,
    })

    const result = response.results[0]

    // Extract flagged categories
    const flaggedCategories = Object.entries(result.categories)
      .filter(([_, flagged]) => flagged)
      .map(([category]) => category)

    // Calculate overall score (higher means more problematic)
    const scores = Object.values(result.category_scores)
    const maxScore = Math.max(...scores)

    // Determine moderation result
    let moderationResult: ContentModerationResult
    if (result.flagged && maxScore > 0.8) {
      moderationResult = ContentModerationResult.REJECTED
    } else if (result.flagged) {
      moderationResult = ContentModerationResult.FLAGGED
    } else {
      moderationResult = ContentModerationResult.APPROVED
    }

    return {
      result: moderationResult,
      categories: flaggedCategories,
      score: maxScore,
      explanation: flaggedCategories.length > 0 ? `Content flagged for: ${flaggedCategories.join(", ")}` : undefined,
    }
  } catch (error) {
    console.error("Content moderation error:", error)
    // Default to flagging content when moderation fails
    return {
      result: ContentModerationResult.FLAGGED,
      categories: ["error"],
      score: 0.5,
      explanation: "Moderation service unavailable",
    }
  }
}

export async function generateContentSummary(content: string): Promise<string> {
  try {
    const openai = await getOpenAIClient()

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes content in 1-2 sentences.",
        },
        {
          role: "user",
          content: `Summarize the following content in 1-2 sentences: ${content}`,
        },
      ],
      max_tokens: 100,
    })

    return response.choices[0].message.content || "No summary available"
  } catch (error) {
    console.error("Content summary generation error:", error)
    return "Summary unavailable"
  }
}

export async function detectContentLanguage(content: string): Promise<string> {
  try {
    const openai = await getOpenAIClient()

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            'Detect the language of the following text and respond with only the language code (e.g., "en", "es", "fr").',
        },
        {
          role: "user",
          content,
        },
      ],
      max_tokens: 10,
    })

    return response.choices[0].message.content?.trim() || "en"
  } catch (error) {
    console.error("Language detection error:", error)
    return "en" // Default to English on error
  }
}

