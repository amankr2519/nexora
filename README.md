# Nexora

Nexora is an AI travel planner built with Next.js. Enter a starting location, destination, budget, currency, and trip duration to receive a structured plan covering:

- Flight or overland travel options
- Areas and lodging recommendations
- Local transportation
- Signature food and dishes
- Famous places prioritized by time
- Shopping ideas
- A budget breakdown and affordability check

Prices are planning estimates, not live airline or hotel prices.

## Requirements

- Node.js 20 or newer
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

## Getting started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Add your API key to `.env.local`:

```env
GEMINI_API_KEY=your_api_key
```

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## How it works

1. The browser collects and submits the trip details from the planner form.
2. `POST /api/plan` validates the request with the shared Zod schema.
3. The server sends the validated input to Gemini with a strict JSON response schema.
4. The response is parsed and validated again before it is returned to the browser.
5. The client renders the summary and itinerary tables.

The Gemini API key is used only on the server and must not be exposed in client-side code.

## API

### `POST /api/plan`

Request body:

```json
{
	"origin": "Mumbai, India",
	"destination": "Tokyo, Japan",
	"budget": 2000,
	"currency": "USD",
	"durationDays": 15
}
```

Successful responses contain the validated `input` and a `plan` with these sections:

```text
summary
flights
stay
transport
food
places
shopping
budgetBreakdown
```

Invalid input returns a `400` response with a general error and field-level validation errors. Provider or server failures return a `500` response.

## Project structure

```text
app/
	api/plan/route.ts       API endpoint for generating plans
	components/             Planner form, state, and result views
	globals.css             Site-wide styles
	layout.tsx              Root layout and metadata
	page.tsx                Main page
lib/
	gemini.ts               Gemini prompt, model call, and JSON schema
	trip-plan.ts            Shared types and Zod validation schemas
public/                   Static assets
```

## Notes

- Supported currencies are USD, EUR, GBP, INR, JPY, AUD, and CAD.
- Trip durations can be 15 days, 1 month, 2 months, or a custom value from 1 to 180 days.
- The generated itinerary is informational and should be verified before booking.
