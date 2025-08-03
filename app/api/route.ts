import { NextResponse } from "next/server";
import OpenAI from "openai";
import { validatePromptInput } from "@/lib/validation";
import { JengaPromptsInput, JengaPromptsOutput } from "@/lib/types";

// Check for OpenAI API key at module initialization
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set. Please add it to your .env.local file.");
}

// Initialize OpenAI with API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to call OpenAI API and process the response
async function callOpenAI(data: JengaPromptsInput): Promise<JengaPromptsOutput> {
  console.log("Calling OpenAI API with data:", JSON.stringify(data));

  try {
    // Create a comprehensive prompt based on the mode and modifiers
    let systemPrompt = `You are an expert prompt engineer. Your task is to enhance and optimize prompts for ${data.promptMode} generation.`;
    
    let userPrompt = `Please enhance this ${data.promptMode.toLowerCase()} prompt: "${data.corePromptIdea}"`;
    
    // Add modifiers to the prompt
    if (Object.keys(data.modifiers).length > 0) {
      userPrompt += `\n\nPlease incorporate these specifications:`;
      Object.entries(data.modifiers).forEach(([key, value]) => {
        if (value) {
          userPrompt += `\n- ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${value}`;
        }
      });
    }
    
    // Add output structure requirements
    if (data.outputStructure === 'Simple JSON') {
      userPrompt += `\n\nPlease provide the response as a simple JSON object with key-value pairs.`;
    } else if (data.outputStructure === 'Detailed JSON') {
      userPrompt += `\n\nPlease provide the response as a detailed JSON object with comprehensive metadata and structured information.`;
    } else {
      userPrompt += `\n\nPlease provide the response as a well-structured descriptive paragraph.`;
    }
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    console.log("Received response from OpenAI API:", JSON.stringify(response));

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI API");
    }

    // Try to parse JSON if requested
    if (data.outputStructure.includes('JSON')) {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedJSON = JSON.parse(jsonMatch[0]);
          return {
            primaryResult: content,
            structuredJSON: parsedJSON,
          };
        }
      } catch (parseError) {
        console.warn("Failed to parse JSON from response, returning as text");
      }
    }
    return {
      primaryResult: content,
    };
  } catch (error) {
    console.error("Error while calling OpenAI API:", error);
    throw error;
  }
}

export async function POST(req: Request) {
  console.log("Received POST request");

  try {
    // Parse the incoming JSON request body
    const rawData = await req.json();
    console.log("Parsed request data:", JSON.stringify(rawData));

    // Validate the input data
    const data = validatePromptInput(rawData);

    // Call OpenAI API to get the enhanced prompt
    const result = await callOpenAI(data);
    console.log("Prompt enhancement completed successfully");

    // Return the structured response
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    
    return NextResponse.json(
      {
        error: "Failed to enhance prompt.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}