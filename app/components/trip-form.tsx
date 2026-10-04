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
      className="planner-form"
    >
      <div className="form-topline">
        <div>
          <span className="form-kicker">THE GOOD PART STARTS HERE</span>
          <h3>Make it yours.</h3>
        </div>
        <span className="form-step">01 <i /> 02</span>
      </div>
      <div className="form-fields">
        <Field
          label="Current address"
          icon="↗"
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
          icon="⌖"
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
        <Field label="Your budget" icon="$" error={fieldErrors.budget?.[0]} htmlFor="budget">
          <div className="budget-control">
            <input
              id="budget"
              type="number"
              min={1}
              step="1"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={`${inputClass} budget-input`}
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className={`${inputClass} currency-select`}
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
          icon="◷"
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
          <Field label="Custom days" icon="◷" htmlFor="customDays">
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
        <p className="form-error">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="submit-button"
      >
        {loading ? "Curating your escape…" : "Build my trip plan"}
        <span aria-hidden="true">{loading ? "✦" : "↗"}</span>
      </button>
    </form>
  );
}

const inputClass =
  "form-input";

function Field({
  label,
  htmlFor,
  error,
  icon,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  icon: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="form-field">
      <span className="field-label">
        <i aria-hidden="true">{icon}</i>
        {label}
      </span>
      {children}
      {error ? (
        <span className="field-error">{error}</span>
      ) : null}
    </label>
  );
}
