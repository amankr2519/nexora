"use client";

import { TripForm } from "@/app/components/trip-form";
import { TripPlanningLoader } from "@/app/components/trip-planning-loader";
import { TripResults } from "@/app/components/trip-results";
import type {
  FieldErrors,
  PlanApiError,
  PlanApiSuccess,
  TripInput,
  TripPlan,
} from "@/lib/trip-plan";
import { useState } from "react";

export function Planner() {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [input, setInput] = useState<TripInput | null>(null);
  const [loadingInput, setLoadingInput] = useState<TripInput | null>(null);

  async function handleSubmit(nextInput: TripInput) {
    setLoading(true);
    setLoadingInput(nextInput);
    setFieldErrors({});
    setFormError(null);
    setPlan(null);
    setInput(null);

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextInput),
      });
      const data = (await response.json()) as PlanApiSuccess | PlanApiError;

      if (!response.ok) {
        const errorBody = data as PlanApiError;
        setPlan(null);
        setInput(null);
        setFieldErrors(errorBody.fieldErrors ?? {});
        setFormError(errorBody.error || "Could not create a plan");
        return;
      }

      const success = data as PlanApiSuccess;
      setPlan(success.plan);
      setInput(success.input);
    } catch {
      setPlan(null);
      setInput(null);
      setFormError("Network error. Try again.");
    } finally {
      setLoading(false);
      setLoadingInput(null);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <TripForm
        loading={loading}
        fieldErrors={fieldErrors}
        formError={formError}
        onSubmit={handleSubmit}
      />
      {loading && loadingInput ? <TripPlanningLoader input={loadingInput} /> : null}
      {plan && input ? <TripResults plan={plan} input={input} /> : null}
    </div>
  );
}
