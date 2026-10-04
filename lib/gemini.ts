import { GoogleGenAI } from "@google/genai";
import { tripPlanSchema, type TripInput, type TripPlan } from "./trip-plan";

const MODEL = "gemini-3.6-flash";
const GROQ_MODEL = "openai/gpt-oss-20b";

const SYSTEM_PROMPT = `You are Nexora, a practical travel planner for a solo traveler.

Return only data that matches the JSON schema. Do not write prose outside the schema fields.

Rules:
- Plan from the traveler's origin to their destination for the given duration and budget.
- Prioritize the most famous and important places that actually fit the time. Do not pad with filler.
- Be honest about money. If flights plus stay already blow the budget, set budgetEnough to "no". If it works but with little room, use "tight". Otherwise "yes".
- All money fields are estimates in the user's currency (not live prices). Say that in notes where useful.
- Pack a realistic pace for the duration (15 days vs 1–2 months should feel very different).
- Flights: typical routes from the origin, cost ranges, and whether round-trip estimates fit the budget.
- Stay: 2–4 area/lodging options with nightly and trip-total estimates.
- Transport: how to get around locally (and between cities if needed).
- Food: must-eat dishes or iconic spots, not a generic restaurant dump.
- Places: ordered by priority so they can hit the highlights first.
- Shopping: markets or specialties worth budget, not luxury filler unless the budget allows.
- budgetBreakdown amounts should be in the same currency and percents should sum to about 100.
- If the trip is overland-only (no reasonable flight), still fill flights with the realistic alternative (train/bus/none) and explain in notes.`;

const numberSchema = { type: "number" };
const stringSchema = { type: "string" };

function objectSchema(
  properties: Record<string, unknown>,
  required: string[],
) {
  return {
    type: "object",
    properties,
    required,
    additionalProperties: false,
  };
}

function arraySchema(items: unknown) {
  return {
    type: "array",
    items,
  };
}

export const tripPlanJsonSchema = objectSchema(
  {
    summary: objectSchema(
      {
        destinationName: stringSchema,
        durationDays: numberSchema,
        budgetEnough: { type: "string", enum: ["yes", "tight", "no"] },
        verdict: stringSchema,
        totalEstimatedCost: numberSchema,
      },
      [
        "destinationName",
        "durationDays",
        "budgetEnough",
        "verdict",
        "totalEstimatedCost",
      ],
    ),
    flights: arraySchema(
      objectSchema(
        {
          from: stringSchema,
          to: stringSchema,
          typicalRoute: stringSchema,
          costMin: numberSchema,
          costMax: numberSchema,
          notes: stringSchema,
        },
        ["from", "to", "typicalRoute", "costMin", "costMax", "notes"],
      ),
    ),
    stay: arraySchema(
      objectSchema(
        {
          area: stringSchema,
          lodgingType: stringSchema,
          nightlyMin: numberSchema,
          nightlyMax: numberSchema,
          totalEstimate: numberSchema,
          why: stringSchema,
        },
        [
          "area",
          "lodgingType",
          "nightlyMin",
          "nightlyMax",
          "totalEstimate",
          "why",
        ],
      ),
    ),
    transport: arraySchema(
      objectSchema(
        {
          mode: stringSchema,
          whenToUse: stringSchema,
          estimatedCost: numberSchema,
          notes: stringSchema,
        },
        ["mode", "whenToUse", "estimatedCost", "notes"],
      ),
    ),
    food: arraySchema(
      objectSchema(
        {
          name: stringSchema,
          type: stringSchema,
          whyMustEat: stringSchema,
          area: stringSchema,
          estimatedCost: numberSchema,
        },
        ["name", "type", "whyMustEat", "area", "estimatedCost"],
      ),
    ),
    places: arraySchema(
      objectSchema(
        {
          name: stringSchema,
          whyFamous: stringSchema,
          suggestedDayOrWeek: stringSchema,
          timeNeeded: stringSchema,
          priority: stringSchema,
        },
        [
          "name",
          "whyFamous",
          "suggestedDayOrWeek",
          "timeNeeded",
          "priority",
        ],
      ),
    ),
    shopping: arraySchema(
      objectSchema(
        {
          itemOrMarket: stringSchema,
          area: stringSchema,
          estimatedSpend: numberSchema,
          notes: stringSchema,
        },
        ["itemOrMarket", "area", "estimatedSpend", "notes"],
      ),
    ),
    budgetBreakdown: arraySchema(
      objectSchema(
        {
          category: stringSchema,
          amount: numberSchema,
          percent: numberSchema,
        },
        ["category", "amount", "percent"],
      ),
    ),
  },
  [
    "summary",
    "flights",
    "stay",
    "transport",
    "food",
    "places",
    "shopping",
    "budgetBreakdown",
  ],
);

function userPrompt(input: TripInput): string {
  return [
    `Origin (current address): ${input.origin}`,
    `Destination: ${input.destination}`,
    `Budget: ${input.budget} ${input.currency}`,
    `Duration: ${input.durationDays} days`,
    "Create the structured trip plan now.",
  ].join("\n");
}

export async function generateTripPlan(input: TripInput): Promise<TripPlan> {
  let geminiError: unknown;

  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: userPrompt(input),
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseJsonSchema: tripPlanJsonSchema,
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      });

      return parseTripPlan(response.text, "Gemini");
    } catch (error) {
      geminiError = error;
    }
  } else {
    geminiError = new Error("GEMINI_API_KEY is not configured");
  }

  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    throw new Error(
      geminiError instanceof Error
        ? `${geminiError.message}. GROQ_API_KEY is not configured for fallback.`
        : "GEMINI_API_KEY and GROQ_API_KEY are not configured",
    );
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${groqApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt(input) },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "trip_plan",
          strict: true,
          schema: tripPlanJsonSchema,
        },
      },
      temperature: 0.7,
      max_completion_tokens: 8192,
      reasoning_effort: "low",
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Groq request failed (${response.status}): ${detail}`);
  }

  const result = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const plan = parseTripPlan(result.choices?.[0]?.message?.content, "Groq");
  return plan;
}

function parseTripPlan(text: string | null | undefined, provider: string): TripPlan {
  if (!text) {
    throw new Error(`${provider} returned an empty response`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`${provider} returned invalid JSON`);
  }

  try {
    return tripPlanSchema.parse(parsed);
  } catch (error) {
    console.error(`${provider} returned data that failed trip-plan validation.`, error);
    throw new Error(
      `${provider} returned a trip plan with missing or invalid fields. Please retry.`,
    );
  }
}
