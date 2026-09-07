import type { Currency, TripInput, TripPlan } from "@/lib/trip-plan";
import type { ReactNode } from "react";

type TripResultsProps = {
  plan: TripPlan;
  input: TripInput;
};

export function TripResults({ plan, input }: TripResultsProps) {
  const money = (value: number) => formatMoney(value, input.currency);
  const enough = plan.summary.budgetEnough;

  return (
    <div className="flex flex-col gap-8">
      <section
        className={`rounded-2xl border p-6 ${bannerClass(enough)}`}
      >
        <p className="text-xs font-semibold uppercase tracking-wide">
          {enoughLabel(enough)}
        </p>
        <h2 className="mt-1 text-2xl font-semibold">
          {plan.summary.destinationName} · {plan.summary.durationDays} days
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6">{plan.summary.verdict}</p>
        <p className="mt-4 text-sm">
          Estimated total:{" "}
          <strong>{money(plan.summary.totalEstimatedCost)}</strong> vs budget{" "}
          <strong>{money(input.budget)}</strong>
        </p>
        <p className="mt-1 text-xs opacity-80">
          Estimates only — not live airline or hotel prices. From {input.origin}.
        </p>
      </section>

      <Section title="Flights" subtitle="Typical routes and estimated round-trip cost">
        <Table
          headers={["From", "To", "Route", "Cost range", "Notes"]}
          rows={plan.flights.map((row) => [
            row.from,
            row.to,
            row.typicalRoute,
            `${money(row.costMin)} – ${money(row.costMax)}`,
            row.notes,
          ])}
        />
      </Section>

      <Section title="Where to stay" subtitle="Areas and lodging types that fit the trip">
        <Table
          headers={["Area", "Type", "Nightly", "Trip total", "Why"]}
          rows={plan.stay.map((row) => [
            row.area,
            row.lodgingType,
            `${money(row.nightlyMin)} – ${money(row.nightlyMax)}`,
            money(row.totalEstimate),
            row.why,
          ])}
        />
      </Section>

      <Section title="Transportation" subtitle="How to get around once you arrive">
        <Table
          headers={["Mode", "When to use", "Estimated cost", "Notes"]}
          rows={plan.transport.map((row) => [
            row.mode,
            row.whenToUse,
            money(row.estimatedCost),
            row.notes,
          ])}
        />
      </Section>

      <Section title="Food — what you must eat" subtitle="Signature dishes and iconic stops">
        <Table
          headers={["Name", "Type", "Area", "Why", "Est. cost"]}
          rows={plan.food.map((row) => [
            row.name,
            row.type,
            row.area,
            row.whyMustEat,
            money(row.estimatedCost),
          ])}
        />
      </Section>

      <Section
        title="Most famous places"
        subtitle="Prioritized so the highlights fit the duration"
      >
        <Table
          headers={["Place", "Why famous", "When", "Time needed", "Priority"]}
          rows={plan.places.map((row) => [
            row.name,
            row.whyFamous,
            row.suggestedDayOrWeek,
            row.timeNeeded,
            row.priority,
          ])}
        />
      </Section>

      <Section title="Shopping" subtitle="Markets and specialties worth a slice of budget">
        <Table
          headers={["What / where", "Area", "Spend", "Notes"]}
          rows={plan.shopping.map((row) => [
            row.itemOrMarket,
            row.area,
            money(row.estimatedSpend),
            row.notes,
          ])}
        />
      </Section>

      <Section title="Budget breakdown" subtitle="Rough split of the trip spend">
        <Table
          headers={["Category", "Amount", "Percent"]}
          rows={plan.budgetBreakdown.map((row) => [
            row.category,
            money(row.amount),
            `${row.percent}%`,
          ])}
        />
      </Section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="text-lg font-semibold text-[#102824]">
        {title}
      </h3>
      <p className="mb-3 text-sm text-stone-600 dark:text-stone-400">{subtitle}</p>
      {children}
    </section>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-stone-300 p-4 text-sm text-stone-500 dark:border-stone-700">
        No items returned for this section.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-stone-100 text-stone-700 dark:bg-stone-900 dark:text-stone-300">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-3 py-2 font-medium whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className="border-t border-stone-200 align-top dark:border-stone-800"
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-3 py-2 leading-5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatMoney(value: number, currency: Currency) {
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

function enoughLabel(value: TripPlan["summary"]["budgetEnough"]) {
  if (value === "yes") return "Budget looks enough";
  if (value === "tight") return "Budget is tight";
  return "Budget is not enough";
}

function bannerClass(value: TripPlan["summary"]["budgetEnough"]) {
  if (value === "yes") {
    return "border-teal-200 bg-teal-50 text-teal-950 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-50";
  }
  if (value === "tight") {
    return "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50";
  }
  return "border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950 dark:text-red-50";
}
