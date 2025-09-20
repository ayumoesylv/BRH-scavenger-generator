// app/api/generate/route.js
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const bodySchema = z.object({
  place: z.string().min(1),
  groupSize: z.number().int().min(1).max(50),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
});

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export async function POST(req) {
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

    // NOTE: ask for riddle-style clues AND an explicit 'answer' field.
    const systemInstruction = `You are generating a Cornell University on Campus scavenger hunt items that require in-person finding.
Generate each clue in a short rhyming riddle format. Relate the clues to things that are Cornell Specific.
Also output an explicit 'answer' field that reveals the solution to the riddle as a concise noun phrase (e.g., "bronze fountain statue", "west entrance turnstiles").

Rules:
- Safety first; no trespassing or risky behavior.
- Family-friendly and culturally sensitive; avoid personal data.
- Tailor to the selected place, group size, and difficulty.
- Output strictly as JSON matching the schema; no extra commentary.`;

    // Added 'answer' to properties + required
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
              answer: { type: "string" },            // <-- NEW
              whyItFitsPlace: { type: "string" },
              verificationHint: { type: "string" },
            },
            required: [
              "title",
              "clue",
              "answer",                               // <-- NEW
              "whyItFitsPlace",
              "verificationHint",
            ],
          },
        },
      },
      required: ["place", "groupSize", "difficulty", "items"],
    };

    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: jsonSchema,
      },
    });

    const prompt = `
Generate a list of scavenger items for:
- Place: ${place}
- Group size: ${groupSize}
- Difficulty: ${difficulty}

Requirements per item:
- "clue": a brief riddle that points to the location/object.
- "answer": the exact solution to the riddle (concise noun phrase).
- "whyItFitsPlace": one sentence tying it to the selected place.
- "verificationHint": how players can prove they found it (e.g., "photo with the plaque").

Keep all items realistically findable today without staff access or disruption.
Vary item types (signs, landmarks, plaques, art, safe nature items, posted schedules).
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = JSON.parse(text);

    // ---- Safety pass: ensure 'answer' exists and is a string for every item ----
    const sanitized = {
      place: String(data.place ?? place),
      groupSize: Number.isFinite(Number(data.groupSize)) ? Number(data.groupSize) : groupSize,
      difficulty: String(data.difficulty ?? difficulty),
      items: Array.isArray(data.items) ? data.items.map((it = {}) => {
        const title = String(it.title ?? "").trim();
        const clue = String(it.clue ?? "").trim();
        const answer = String(it.answer ?? "").trim() || title; // fallback to title
        const whyItFitsPlace = String(it.whyItFitsPlace ?? "").trim();
        const verificationHint = String(it.verificationHint ?? "").trim();
        return { title, clue, answer, whyItFitsPlace, verificationHint };
      }) : [],
    };

    return NextResponse.json(sanitized);
  } catch (err) {
    console.error("Gemini error:", err?.message || err);
    return NextResponse.json({ error: "Gemini error" }, { status: 500 });
  }
}