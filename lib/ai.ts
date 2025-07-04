import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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

interface ImprovedContentResult {
  improvedContent: string;
  improvements: string[];
}

export async function improveContentStyle(
  title: string,
  content: string
): Promise<ImprovedContentResult | null> {
  const prompt = `
    You are a professional Korean writing editor specializing in blog content improvement.
    Please improve the following blog post while maintaining the author's voice and original meaning.

    **Instructions:**
    1. Improve readability and flow
    2. Enhance clarity and coherence
    3. Fix any grammatical issues
    4. Make the writing more engaging
    5. Maintain the original tone and style
    6. Keep the content length similar
    7. Respond in Korean

    **Original Title:** ${title}

    **Original Content:**
    ${content}

    Please provide the output in JSON format with the following keys:
    - "improvedContent": The improved version of the content
    - "improvements": An array of strings describing what improvements were made

    Do not include any explanatory text or markdown formatting. Only the JSON object.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json\n|```/g, "").trim();
    const improvement: ImprovedContentResult = JSON.parse(jsonString);

    return improvement;
  } catch (error) {
    console.error("Error improving content style with Gemini:", error);
    return null;
  }
}

interface SmartSuggestionsResult {
  suggestedTags: Array<{
    name: string;
    confidence: number;
    reason: string;
  }>;
  suggestedCategories: Array<{
    name: string;
    confidence: number;
    reason: string;
  }>;
  seoKeywords: string[];
  readabilityScore: number;
  contentGaps: string[];
}

export async function getSmartSuggestions(
  title: string,
  content: string,
  existingTags: string[] = [],
  availableCategories: string[] = []
): Promise<SmartSuggestionsResult | null> {
  const prompt = `
    You are an AI content strategist analyzing a Korean blog post to provide intelligent suggestions.
    
    **Post Title:** ${title}
    **Post Content:** ${content}
    **Existing Tags:** ${existingTags.join(", ")}
    **Available Categories:** ${availableCategories.join(", ")}

    Please analyze the content and provide:

    1. **Tag Suggestions**: 5-8 relevant tags with confidence scores (0-1) and reasoning
    2. **Category Suggestions**: Top 3 category matches with confidence scores and reasoning
    3. **SEO Keywords**: 5-10 important keywords for SEO optimization
    4. **Readability Score**: Rate readability from 1-10 (10 being most readable)
    5. **Content Gaps**: Suggest 2-3 areas that could be expanded or improved

    Respond in Korean for reasons and content gaps.

    Provide output in JSON format with these keys:
    - "suggestedTags": Array of {name, confidence, reason}
    - "suggestedCategories": Array of {name, confidence, reason}
    - "seoKeywords": Array of strings
    - "readabilityScore": Number (1-10)
    - "contentGaps": Array of strings

    Do not include explanatory text or markdown. Only JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json\n|```/g, "").trim();
    const suggestions: SmartSuggestionsResult = JSON.parse(jsonString);

    return suggestions;
  } catch (error) {
    console.error("Error getting smart suggestions with Gemini:", error);
    return null;
  }
}

export async function generateSlugFromTitle(title: string): Promise<string> {
  const prompt = `
    Create a SEO-friendly URL slug from this Korean blog post title: "${title}"
    
    Requirements:
    - Use only lowercase English letters, numbers, and hyphens
    - No spaces or special characters
    - Maximum 60 characters
    - Translate key concepts to English
    - Make it descriptive and SEO-friendly
    
    Return only the slug, nothing else.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const slug = response.text().trim().replace(/[^a-z0-9-]/g, '');
    
    return slug || title.toLowerCase().replace(/[^a-z0-9ㄱ-ㅎ가-힣]/g, '-').replace(/-+/g, '-').slice(0, 60);
  } catch (error) {
    console.error("Error generating slug with Gemini:", error);
    return title.toLowerCase().replace(/[^a-z0-9ㄱ-ㅎ가-힣]/g, '-').replace(/-+/g, '-').slice(0, 60);
  }
}