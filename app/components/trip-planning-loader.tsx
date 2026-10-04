"use client";

import { useEffect, useState } from "react";
import type { TripInput } from "@/lib/trip-plan";

const planningStages = [
  "Finding the best way there…",
  "Choosing areas worth staying in…",
  "Curating a taste of the place…",
  "Prioritizing the can’t-miss moments…",
  "Balancing the budget…",
  "Putting your field guide together…",
];

type TripPlanningLoaderProps = { input: TripInput };

export function TripPlanningLoader({ input }: TripPlanningLoaderProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStage((current) => (current + 1) % planningStages.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      className="planning-loader"
      aria-labelledby="planning-title"
      aria-live="polite"
    >
      <div className="loader-sky" aria-hidden="true">
        <div className="loader-globe">
          <span />
          <i />
          <b />
        </div>
        <div className="loader-route">
          <span className="route-dashes" />
          <span className="route-origin">
            <i />
          </span>
          <span className="route-destination">
            <i />
          </span>
          <span className="route-plane" aria-hidden="true">
            <PlaneIcon />
          </span>
        </div>
        <div className="loader-coordinates" aria-hidden="true">
          N 35° 00′ &nbsp; E 135° 46′
        </div>
      </div>
      <div className="loader-copy">
        <p className="loader-kicker">
          <span /> NEXORA IS AT WORK
        </p>
        <h3 id="planning-title">
          Mapping your
          <br />
          <em>next chapter.</em>
        </h3>
        <p className="loader-stage" key={stage}>
          {planningStages[stage]}
        </p>
        <div className="loader-route-labels">
          <div>
            <span>FROM</span>
            <strong>{input.origin}</strong>
          </div>
          <span className="loader-arrow">→</span>
          <div>
            <span>TO</span>
            <strong>{input.destination}</strong>
          </div>
        </div>
        <div className="loader-trip-meta">
          <span>{input.durationDays} DAYS</span>
          <i />
          <span>{formatMoney(input.budget, input.currency)} BUDGET</span>
          <span className="loader-breathe">
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
    </section>
  );
}

export function PlaneIcon() {
  return (
    <svg viewBox="0 0 32 32" role="img" aria-label="Airplane">
      <path
        d="M29 4.5c-.8-.8-2-.8-3.1-.2L17 10 7.1 5.7c-.7-.3-1.5-.1-2 .4l-.8.8 7.6 6.7-4.1 2.7-3.4-1.5c-.5-.2-1.1-.1-1.5.3l-.6.6 3.6 3.3.7 4.9.7.3c.5.2 1.1.1 1.5-.3l2.3-2.9 9.5-5.7 3.8 10.5 1-.6c.7-.4 1-1.2.8-2L22 11.3l6.8-4.1c1.1-.7 1.1-1.9.2-2.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function formatMoney(value: number, currency: TripInput["currency"]) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value}`;
  }
}
