import { z } from "zod";

export const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "INR",
  "JPY",
  "AUD",
  "CAD",
] as const;

export type Currency = (typeof CURRENCIES)[number];

export const DURATION_PRESETS = [
  { id: "15", label: "15 days", days: 15 },
  { id: "30", label: "1 month", days: 30 },
  { id: "60", label: "2 months", days: 60 },
  { id: "custom", label: "Custom", days: null },
] as const;

export const tripInputSchema = z.object({
  origin: z.string().trim().min(2, "Enter your current address or city"),
  destination: z.string().trim().min(2, "Enter a destination"),
  budget: z.number().positive("Budget must be greater than 0"),
  currency: z.enum(CURRENCIES),
  durationDays: z
    .number()
    .int()
    .min(1, "Duration must be at least 1 day")
    .max(180, "Duration cannot exceed 180 days"),
});

export type TripInput = z.infer<typeof tripInputSchema>;

export const budgetEnoughSchema = z.enum(["yes", "tight", "no"]);

export const tripPlanSchema = z.object({
  summary: z.object({
    destinationName: z.string(),
    durationDays: z.number(),
    budgetEnough: budgetEnoughSchema,
    verdict: z.string(),
    totalEstimatedCost: z.number(),
  }),
  flights: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      typicalRoute: z.string(),
      costMin: z.number(),
      costMax: z.number(),
      notes: z.string(),
    }),
  ),
  stay: z.array(
    z.object({
      area: z.string(),
      lodgingType: z.string(),
      nightlyMin: z.number(),
      nightlyMax: z.number(),
      totalEstimate: z.number(),
      why: z.string(),
    }),
  ),
  transport: z.array(
    z.object({
      mode: z.string(),
      whenToUse: z.string(),
      estimatedCost: z.number(),
      notes: z.string(),
    }),
  ),
  food: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      whyMustEat: z.string(),
      area: z.string(),
      estimatedCost: z.number(),
    }),
  ),
  places: z.array(
    z.object({
      name: z.string(),
      whyFamous: z.string(),
      suggestedDayOrWeek: z.string(),
      timeNeeded: z.string(),
      priority: z.string(),
    }),
  ),
  shopping: z.array(
    z.object({
      itemOrMarket: z.string(),
      area: z.string(),
      estimatedSpend: z.number(),
      notes: z.string(),
    }),
  ),
  budgetBreakdown: z.array(
    z.object({
      category: z.string(),
      amount: z.number(),
      percent: z.number(),
    }),
  ),
});

export type TripPlan = z.infer<typeof tripPlanSchema>;

export type FieldErrors = Partial<Record<keyof TripInput, string[]>>;

export type PlanApiError = {
  error: string;
  fieldErrors?: FieldErrors;
};

export type PlanApiSuccess = {
  plan: TripPlan;
  input: TripInput;
};
