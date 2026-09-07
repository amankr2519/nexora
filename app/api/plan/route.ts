import { generateTripPlan } from "@/lib/gemini";
import { tripInputSchema, type FieldErrors } from "@/lib/trip-plan";
import { z } from "zod";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = tripInputSchema.safeParse(body);
  if (!parsed.success) {
    const flattened = z.flattenError(parsed.error);
    return Response.json(
      {
        error: "Please fix the highlighted fields",
        fieldErrors: flattened.fieldErrors as FieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const plan = await generateTripPlan(parsed.data);
    return Response.json({ plan, input: parsed.data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate trip plan";
    const isConfig = message.includes("GEMINI_API_KEY");
    return Response.json(
      { error: isConfig ? "Server is missing GEMINI_API_KEY" : message },
      { status: 502 },
    );
  }
}
