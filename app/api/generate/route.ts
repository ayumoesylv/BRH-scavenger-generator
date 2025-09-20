import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const bodySchema = z.object({
  place: z.string().min(1),
  groupSize: z.number().int().min(1).max(50),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
});

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { place, groupSize, difficulty = "medium" } = parsed.data;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemInstruction = `You are generating on-campus scavenger hunt items that require in-person finding.
Rules:
- Safety first; no trespassing or risky behavior.
- Family-friendly.
- Culturally sensitive; avoid personal data.
- Tailor to the selected place, group size, and difficulty.
- Output strictly as JSON matching the schema; no extra commentary.`;

    const jsonSchema = {
      type: "object",
      properties: {
        place: { type: "string" },
        groupSize: { type: "number" },
        difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
        items: {
          type: "array",
          minItems: 7,
          maxItems: 12,
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              clue: { type: "string" },
              whyItFitsPlace: { type: "string" },
              estimatedTimeMin: { type: "number" },
              verificationHint: { type: "string" }
            },
            required: [
              "title",
              "clue",
              "whyItFitsPlace",
              "estimatedTimeMin",
              "verificationHint"
            ]
          }
        }
      },
      required: ["place", "groupSize", "difficulty", "items"]
    } as const;

    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: jsonSchema as any,
      },
    });

    const prompt = `
Generate a list of scavenger items for:
- Place: ${place}
- Group size: ${groupSize}
- Difficulty: ${difficulty}

Keep all items realistically findable at that location today without staff access or disruption.
Vary item types (signs, landmarks, plaques, art, safe nature items, posted schedules).
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Gemini error:", err?.message || err);
    return NextResponse.json({ error: "Gemini error" }, { status: 500 });
  }
}
