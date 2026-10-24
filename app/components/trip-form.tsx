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
      className="relative min-w-0 self-start overflow-hidden rounded-[1.4rem] border border-[#ddd6c9] bg-[#fffdf8] p-5 shadow-[0_22px_70px_rgba(30,48,40,.09)] sm:p-8"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-coral via-[#e3b86d] to-[#739887]" />
      <div className="mb-7 flex items-center justify-between">
        <div>
          <span className="text-[.6rem] font-extrabold tracking-[.16em] text-[#a45e49]">THE GOOD PART STARTS HERE</span>
          <h3 className="mt-1 text-[clamp(1.8rem,3vw,2.35rem)] font-normal leading-tight tracking-[-.045em] text-deep">Make it yours.</h3>
        </div>
        <span className="inline-flex items-center gap-2 text-[.65rem] tracking-[.08em] text-[#687771]">01 <i className="size-[.38rem] rounded-full bg-coral" /> 02</span>
      </div>
      <div className="grid grid-cols-1 gap-[1.15rem] sm:grid-cols-2">
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
          <div className="grid grid-cols-[minmax(0,1fr)_6.4rem] gap-2">
            <input
              id="budget"
              type="number"
              min={1}
              step="1"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={inputClass}
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className={`${inputClass} cursor-pointer font-bold`}
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
        <p className="mt-4 rounded-[.7rem] bg-[#fff0ed] px-4 py-3 text-[.8rem] text-[#9a3730]">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex min-h-[3.4rem] w-full items-center justify-between rounded-[.8rem] border-0 bg-deep px-5 text-[.82rem] font-bold text-[#fffdf8] transition hover:-translate-y-px hover:bg-[#24443b] disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? "Curating your escape…" : "Build my trip plan"}
        <span className="text-xl text-[#f19a79]" aria-hidden="true">{loading ? "✦" : "↗"}</span>
      </button>
    </form>
  );
}

const inputClass = "h-[3.2rem] w-full min-w-0 appearance-none rounded-[.78rem] border border-[#e3ded4] bg-white px-4 text-[.86rem] text-[#18302b] outline-none transition focus:border-[#718c7d] focus:ring-4 focus:ring-[#718c7d]/15 placeholder:text-[#a7aaa1]";

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
    <label htmlFor={htmlFor} className="flex min-w-0 flex-col gap-2">
      <span className="flex items-center gap-2 text-[.76rem] font-semibold text-[#334b43]">
        <i className="inline-flex size-[1.4rem] items-center justify-center rounded-full bg-[#f4e7dc] text-[.7rem] not-italic text-[#a45e49]" aria-hidden="true">{icon}</i>
        {label}
      </span>
      {children}
      {error ? (
        <span className="text-[.7rem] text-[#a33e36]">{error}</span>
      ) : null}
    </label>
  );
}
