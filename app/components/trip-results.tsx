import type { ReactNode } from "react";
import type { TripInput, TripPlan } from "@/lib/trip-plan";

type TripResultsProps = { plan: TripPlan; input: TripInput };
type TableRow = { key: string; cells: ReactNode[] };

function money(value: number, currency: TripInput["currency"]) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${Math.round(value).toLocaleString()}`;
  }
}

function DataTable({
  title,
  description,
  columns,
  rows,
}: {
  title: string;
  description: string;
  columns: string[];
  rows: TableRow[];
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-[.9rem] border border-[#e6e1d7] bg-[#fffefa]">
      <div className="flex items-center justify-between gap-4 px-4 pb-3 pt-4">
        <div>
          <h3 className="m-0 font-serif text-2xl font-normal tracking-tight text-[#203b31]">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-[#78837a]">{description}</p>
        </div>
        <span className="whitespace-nowrap text-xs text-[#68766c]">
          {rows.length} {rows.length === 1 ? "item" : "items"}
        </span>
      </div>
      {rows.length ? (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead className="bg-[#f1f2ec]">
              <tr>
                {columns.map((column) => (
                  <th className="whitespace-nowrap px-4 py-3 text-[.82rem] font-bold tracking-wide text-[#59695f]" key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  {row.cells.map((cell, index) => (
                    <td className={`min-w-28 border-t border-[#eeeae2] px-4 py-3 text-[.92rem] leading-relaxed text-[#46584d] align-top ${index === 0 ? "font-semibold text-[#294437]" : ""}`} key={`${row.key}-${index}`} data-label={columns[index]}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="m-0 border-t border-[#eeeae2] px-4 py-4 text-[.9rem] text-[#68766c]">
          No recommendations were included for this section.
        </p>
      )}
    </section>
  );
}

export function TripResults({ plan, input }: TripResultsProps) {
  const { summary } = plan;
  const statusLabel =
    summary.budgetEnough === "yes"
      ? "Within budget"
      : summary.budgetEnough === "tight"
        ? "Budget is tight"
        : "Budget is not enough";
  const summaryRows: TableRow[] = [
    { key: "destination", cells: ["Destination", summary.destinationName] },
    { key: "duration", cells: ["Duration", `${summary.durationDays} days`] },
    { key: "origin", cells: ["Starting from", input.origin] },
    {
      key: "estimate",
      cells: [
        "Estimated total",
        money(summary.totalEstimatedCost, input.currency),
      ],
    },
    {
      key: "budget",
      cells: ["Your budget", money(input.budget, input.currency)],
    },
    { key: "verdict", cells: ["Plan overview", summary.verdict] },
  ];

  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-[1.15rem] border border-[#e4e0d7] bg-[#fbfaf6] p-3 text-[#233b32] sm:p-6">
      <section
        className={`overflow-hidden rounded-[.9rem] border p-4 sm:p-6 ${summary.budgetEnough === "no" ? "border-[#f0cbc4] bg-[#fff0ed]" : summary.budgetEnough === "tight" ? "border-[#ead9ac] bg-[#fbf3df]" : "border-[#dce5db] bg-[#e9eee7]"}`}
        aria-labelledby="trip-summary-title"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-[.78rem] font-bold tracking-[.11em] text-[#758078]">YOUR TRIP PLAN</p>
            <h2 className="m-0 break-words font-serif text-[clamp(1.8rem,5vw,3rem)] font-normal leading-none tracking-[-.045em] text-[#1d382f]" id="trip-summary-title">{summary.destinationName}</h2>
          </div>
          <strong className={`rounded-full px-4 py-2 text-[.82rem] ${summary.budgetEnough === "no" ? "bg-[#f4d5cf] text-[#8d3028]" : summary.budgetEnough === "tight" ? "bg-[#f0e2bd] text-[#80642c]" : "bg-[#dce8d9] text-[#3c6248]"}`}>{statusLabel}</strong>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left [&_tr]:border-t [&_tr]:border-[#2c4637]/15 [&_th]:py-3 [&_th]:pr-3 [&_th]:align-top [&_th]:text-[.9rem] [&_th]:font-semibold [&_th]:text-[#69776d] [&_td]:py-3 [&_td]:pr-3 [&_td]:align-top [&_td]:text-[.95rem] [&_td]:leading-relaxed [&_td]:text-[#2e493a]">
            <tbody>
              {summaryRows.map(({ key, cells }) => (
                <tr key={key}>
                  <th scope="row">{cells[0]}</th>
                  <td>{cells[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <DataTable
        title="Flights"
        description="Suggested routes and estimated fares"
        columns={["From", "To", "Typical route", "Estimated cost", "Notes"]}
        rows={plan.flights.map((item, index) => ({
          key: `flight-${index}`,
          cells: [
            item.from,
            item.to,
            item.typicalRoute,
            `${money(item.costMin, input.currency)} – ${money(item.costMax, input.currency)}`,
            item.notes,
          ],
        }))}
      />
      <DataTable
        title="Stay"
        description="Areas and lodging options for your trip"
        columns={[
          "Area",
          "Lodging",
          "Nightly cost",
          "Stay estimate",
          "Why stay here",
        ]}
        rows={plan.stay.map((item, index) => ({
          key: `stay-${index}`,
          cells: [
            item.area,
            item.lodgingType,
            `${money(item.nightlyMin, input.currency)} – ${money(item.nightlyMax, input.currency)}`,
            money(item.totalEstimate, input.currency),
            item.why,
          ],
        }))}
      />
      <DataTable
        title="Transport"
        description="Ways to get around at your destination"
        columns={["Mode", "When to use", "Estimated cost", "Notes"]}
        rows={plan.transport.map((item, index) => ({
          key: `transport-${index}`,
          cells: [
            item.mode,
            item.whenToUse,
            money(item.estimatedCost, input.currency),
            item.notes,
          ],
        }))}
      />
      <DataTable
        title="Food"
        description="Local dishes and food stops to try"
        columns={[
          "Dish / place",
          "Type",
          "Area",
          "Estimated cost",
          "Why try it",
        ]}
        rows={plan.food.map((item, index) => ({
          key: `food-${index}`,
          cells: [
            item.name,
            item.type,
            item.area,
            money(item.estimatedCost, input.currency),
            item.whyMustEat,
          ],
        }))}
      />
      <DataTable
        title="Places"
        description="Recommended sights, in suggested order"
        columns={[
          "Place",
          "Suggested day",
          "Time needed",
          "Priority",
          "Why visit",
        ]}
        rows={plan.places.map((item, index) => ({
          key: `place-${index}`,
          cells: [
            item.name,
            item.suggestedDayOrWeek,
            item.timeNeeded,
            item.priority,
            item.whyFamous,
          ],
        }))}
      />
      <DataTable
        title="Shopping"
        description="Markets and items worth setting money aside for"
        columns={["Item / market", "Area", "Estimated spend", "Notes"]}
        rows={plan.shopping.map((item, index) => ({
          key: `shopping-${index}`,
          cells: [
            item.itemOrMarket,
            item.area,
            money(item.estimatedSpend, input.currency),
            item.notes,
          ],
        }))}
      />
      <DataTable
        title="Budget breakdown"
        description="Estimated spend by category"
        columns={["Category", "Amount", "Share of budget"]}
        rows={plan.budgetBreakdown.map((item, index) => ({
          key: `budget-${index}`,
          cells: [
            item.category,
            money(item.amount, input.currency),
            `${item.percent}%`,
          ],
        }))}
      />
    </div>
  );
}
