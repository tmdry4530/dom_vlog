import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-lite" });

interface AiAnalysisResult {
  summary: string;
  writingStyle: string;
  suggestedTags: string[];
  suggestedCategory: string;
}

export async function analyzePostContent(
  title: string,
  content: string,
  allCategories: { id: string; name: string; slug: string }[]
): Promise<AiAnalysisResult | null> {
  const categoryNames = allCategories.map((c) => c.name).join(", ");

  const prompt = `
    You are a highly intelligent AI assistant specializing in content analysis for a blog.
    Given the following blog post title, content, and a list of available categories, please perform the following tasks:

    1.  **Summarize the post:** Create a concise summary of the post content (around 50-100 words).
    2.  **Analyze Writing Style:** Briefly describe the writing style (e.g., formal, informal, technical, narrative, humorous).
    3.  **Suggest Tags:** Provide 3-5 relevant tags (keywords) for the post. The tags should be single words or short phrases.
    4.  **Suggest a Category:** From the provided list of categories, choose the single most relevant one.

    **Post Title:** ${title}

    **Post Content:**
    ${content}

    **Available Categories:**
    ${categoryNames}

    Please provide the output in a clean, parsable JSON format with the following keys:
    - "summary"
    - "writingStyle"
    - "suggestedTags" (as an array of strings)
    - "suggestedCategory" (as a single string)

    Do not include any explanatory text or markdown formatting in your response. Only the JSON object.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response to ensure it's valid JSON
    const jsonString = text.replace(/```json\n|```/g, "").trim();
    const analysis: AiAnalysisResult = JSON.parse(jsonString);

    return analysis;
  } catch (error) {
    console.error("Error analyzing post content with Gemini:", error);
    return null;
  }
}