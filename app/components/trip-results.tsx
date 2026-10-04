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
    <section className="trip-table-section">
      <div className="trip-table-heading">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <span>
          {rows.length} {rows.length === 1 ? "item" : "items"}
        </span>
      </div>
      {rows.length ? (
        <div className="trip-table-scroll">
          <table className="trip-data-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  {row.cells.map((cell, index) => (
                    <td key={`${row.key}-${index}`} data-label={columns[index]}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="trip-table-empty">
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
    <div className="trip-response">
      <section
        className={`trip-summary ${summary.budgetEnough === "no" ? "trip-summary-over" : summary.budgetEnough === "tight" ? "trip-summary-tight" : ""}`}
        aria-labelledby="trip-summary-title"
      >
        <div className="trip-summary-heading">
          <div>
            <p>YOUR TRIP PLAN</p>
            <h2 id="trip-summary-title">{summary.destinationName}</h2>
          </div>
          <strong>{statusLabel}</strong>
        </div>
        <div className="trip-summary-table-wrap">
          <table className="trip-summary-table">
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
