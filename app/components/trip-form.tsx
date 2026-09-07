"use client";

import {
  CURRENCIES,
  DURATION_PRESETS,
  type Currency,
  type FieldErrors,
  type TripInput,
} from "@/lib/trip-plan";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

type TripFormProps = {
  loading: boolean;
  fieldErrors: FieldErrors;
  formError: string | null;
  onSubmit: (input: TripInput) => void;
};

export function TripForm({
  loading,
  fieldErrors,
  formError,
  onSubmit,
}: TripFormProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("2000");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [preset, setPreset] = useState<string>("15");
  const [customDays, setCustomDays] = useState("21");

  const durationDays = useMemo(() => {
    const match = DURATION_PRESETS.find((item) => item.id === preset);
    if (match && match.days !== null) {
      return match.days;
    }
    return Number(customDays);
  }, [customDays, preset]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      origin,
      destination,
      budget: Number(budget),
      currency,
      durationDays,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="planner-form rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-950"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Current address"
          error={fieldErrors.origin?.[0]}
          htmlFor="origin"
        >
          <input
            id="origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="e.g. Mumbai, India"
            className={inputClass}
            autoComplete="address-level2"
          />
        </Field>
        <Field
          label="Destination"
          error={fieldErrors.destination?.[0]}
          htmlFor="destination"
        >
          <input
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Tokyo, Japan"
            className={inputClass}
          />
        </Field>
        <Field label="Budget" error={fieldErrors.budget?.[0]} htmlFor="budget">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2">
            <input
              id="budget"
              type="number"
              min={1}
              step="1"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={`${inputClass} min-w-0`}
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className={`${inputClass} w-24 shrink-0`}
              aria-label="Currency"
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
        </Field>
        <Field
          label="Duration"
          error={fieldErrors.durationDays?.[0]}
          htmlFor="duration"
        >
          <select
            id="duration"
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            className={inputClass}
          >
            {DURATION_PRESETS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        {preset === "custom" ? (
          <Field label="Custom days" htmlFor="customDays">
            <input
              id="customDays"
              type="number"
              min={1}
              max={180}
              value={customDays}
              onChange={(e) => setCustomDays(e.target.value)}
              className={inputClass}
            />
          </Field>
        ) : null}
      </div>

      {formError ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-teal-800 px-5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Planning your trip…" : "Plan my trip"}
      </button>
    </form>
  );
}

const inputClass =
  "h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 outline-none ring-teal-700/30 focus:ring-2 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100";

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex min-w-0 flex-col gap-1.5 text-sm">
      <span className="font-medium text-stone-800 dark:text-stone-200">
        {label}
      </span>
      {children}
      {error ? (
        <span className="text-xs text-red-700 dark:text-red-400">{error}</span>
      ) : null}
    </label>
  );
}
