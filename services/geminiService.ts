import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ReviewReport, IssueCategory, Severity } from "../types";
import { v4 as uuidv4 } from 'uuid'; // Note: In a real environment we'd install this, but for simplicity we'll generate a random string below

// Mock UUID generator since we can't easily add packages here
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const SYSTEM_INSTRUCTION = `
You are a senior principal software engineer and code reviewer. 
Your task is to analyze source code and provide a structured, critical, and helpful review.
Focus on:
1. Readability: Is the code easy to understand?
2. Modularity: Is the code well-structured and decoupled?
3. Code Smells: Are there anti-patterns?
4. Potential Bugs: Logic errors, race conditions, edge cases.
5. Best Practices: Naming conventions, modern language features.
6. Security: Vulnerabilities like injection, weak auth, etc.

Be strict but constructive. Always provide a specific line number if applicable.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A high-level executive summary of the code quality (max 3 sentences).",
    },
    language: {
      type: Type.STRING,
      description: "The detected programming language.",
    },
    scores: {
      type: Type.OBJECT,
      description: "Numeric scores from 0 to 100.",
      properties: {
        readability: { type: Type.NUMBER },
        maintainability: { type: Type.NUMBER },
        security: { type: Type.NUMBER },
        performance: { type: Type.NUMBER },
      },
      required: ["readability", "maintainability", "security", "performance"],
    },
    issues: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            enum: [
              "readability",
              "modularity",
              "code_smell",
              "bug",
              "best_practice",
              "security",
            ],
          },
          severity: {
            type: Type.STRING,
            enum: ["high", "medium", "low", "info"],
          },
          line: { type: Type.INTEGER, description: "Line number where issue occurs, if applicable." },
          description: { type: Type.STRING },
          suggestion: { type: Type.STRING, description: "Actionable advice to fix the issue." },
        },
        required: ["category", "severity", "description", "suggestion"],
      },
    },
  },
  required: ["summary", "language", "scores", "issues"],
};

export const analyzeCode = async (fileName: string, codeContent: string): Promise<ReviewReport> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Please review the following file: "${fileName}".
    
    CODE CONTENT:
    \`\`\`
    ${codeContent}
    \`\`\`
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const analysisResult = JSON.parse(text);

    // Hydrate into full ReviewReport object
    const report: ReviewReport = {
      id: generateId(),
      fileName,
      timestamp: Date.now(),
      rawCode: codeContent,
      ...analysisResult
    };

    return report;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};