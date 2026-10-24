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
      className="grid min-h-[25rem] grid-cols-1 overflow-hidden rounded-[1.35rem] border border-[#e2dbce] bg-[#f7f3ea] md:grid-cols-2"
      aria-labelledby="planning-title"
      aria-live="polite"
    >
      <div className="relative flex min-h-[15rem] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_35%_47%,rgba(205,175,128,.24),transparent_38%),linear-gradient(155deg,#e6e8dc,#d5dfd6_58%,#c8d6d1)] md:min-h-[25rem]" aria-hidden="true">
        <div className="relative size-52 animate-spin rounded-full border border-[#2e5345]/20 before:absolute before:inset-y-0 before:left-[28%] before:right-[28%] before:rounded-full before:border before:border-[#2e5345]/15 after:absolute after:inset-y-0 after:left-[42%] after:right-[42%] after:rounded-full after:border after:border-[#2e5345]/15 md:size-68">
          <span className="absolute inset-x-[-4%] top-1/4 rounded-[50%] border-y border-[#2e5345]/15" />
          <i className="absolute left-[-5%] right-[-5%] top-[38%] rounded-[50%] border-t border-[#2e5345]/15" />
          <b className="absolute left-[-5%] right-[-5%] top-[62%] rounded-[50%] border-t border-[#2e5345]/15" />
        </div>
        <div className="absolute inset-x-[8%] top-1/2 h-24 -translate-y-1/2">
          <span className="absolute inset-x-4 top-1/2 border-t border-dashed border-[#335b48]/65" />
          <span className="absolute left-3 top-[calc(50%-0.42rem)] flex size-3.5 items-center justify-center rounded-full border border-[#4a715b] bg-[#f7f3ea]"><i className="size-1.5 rounded-full bg-[#4a715b]" />
          </span>
          <span className="absolute right-3 top-[calc(50%-0.42rem)] flex size-3.5 items-center justify-center rounded-full border border-[#bd755e] bg-[#f7f3ea] shadow-[0_0_0_7px_rgba(189,117,94,.1)]"><i className="size-1.5 animate-ping rounded-full bg-[#bd755e]" />
          </span>
          <span className="absolute left-1/2 top-[calc(50%-1rem)] text-[#294f41] drop-shadow-md" aria-hidden="true">
            <PlaneIcon />
          </span>
        </div>
        <div className="absolute bottom-5 right-5 text-[.54rem] tracking-[.16em] text-[#2d4c3e]/60" aria-hidden="true">
          N 35° 00′ &nbsp; E 135° 46′
        </div>
      </div>
      <div className="self-center p-6 sm:p-10">
        <p className="mb-5 flex items-center gap-2 text-[.59rem] font-extrabold tracking-[.16em] text-[#a65f4b]">
          <span className="size-1.5 rounded-full bg-[#b36c52]" /> NEXORA IS AT WORK
        </p>
        <h3 className="m-0 font-serif text-[clamp(2.15rem,4vw,3.45rem)] leading-[.99] tracking-[-.055em] text-[#19352c]" id="planning-title">
          Mapping your
          <br />
          <em>next chapter.</em>
        </h3>
        <p className="my-4 min-h-6 text-sm leading-relaxed text-[#627269]" key={stage}>
          {planningStages[stage]}
        </p>
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-y border-[#ddd8cd] py-4">
          <div className="min-w-0">
            <span className="text-[.52rem] font-bold tracking-[.13em] text-[#8b958b]">FROM</span>
            <strong className="mt-1 block overflow-hidden text-ellipsis whitespace-nowrap font-serif text-[.95rem] font-normal text-[#243d33]">{input.origin}</strong>
          </div>
          <span className="text-base text-[#b47459]">→</span>
          <div className="min-w-0 text-right">
            <span className="text-[.52rem] font-bold tracking-[.13em] text-[#8b958b]">TO</span>
            <strong className="mt-1 block overflow-hidden text-ellipsis whitespace-nowrap font-serif text-[.95rem] font-normal text-[#243d33]">{input.destination}</strong>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 text-[.52rem] font-bold tracking-[.13em] text-[#8b958b]">
          <span>{input.durationDays} DAYS</span>
          <i className="size-1 rounded-full bg-[#be856b]" />
          <span>{formatMoney(input.budget, input.currency)} BUDGET</span>
          <span className="ml-auto inline-flex gap-1">
            <i className="size-1 animate-pulse rounded-full bg-[#b97057]" />
            <i className="size-1 animate-pulse rounded-full bg-[#b97057] [animation-delay:160ms]" />
            <i className="size-1 animate-pulse rounded-full bg-[#b97057] [animation-delay:320ms]" />
          </span>
        </div>
      </div>
    </section>
  );
}

export function PlaneIcon() {
  return (
    <svg className="size-7 rotate-12" viewBox="0 0 32 32" role="img" aria-label="Airplane">
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
