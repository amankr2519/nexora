import { Planner } from "@/app/components/planner";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <header className="flex items-center justify-between gap-8 bg-deep px-5 py-5 text-[#f3efe6] sm:px-[5vw]">
        <a className="inline-flex items-center gap-2.5 text-[1.05rem] font-bold tracking-[-.04em] text-inherit no-underline" href="#planner" aria-label="Nexora home">
          <span className="inline-flex size-7 items-center justify-center rounded-full border border-coral font-serif text-sm text-coral">N</span>
          <span>Nexora</span>
        </a>
        <p className="hidden text-[.72rem] uppercase tracking-[.06em] text-[#b7c2bd] sm:block">Travel planning, made personal</p>
        <a className="text-[.72rem] uppercase tracking-[.06em] text-[#f3efe6] no-underline" href="#planner">
          Start planning <span className="ml-1 text-base text-coral" aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        <section className="relative grid min-h-0 grid-cols-1 bg-deep px-5 pb-8 pt-20 text-[#f3efe6] md:min-h-[min(710px,78vh)] md:grid-cols-[minmax(0,.9fr)_minmax(19rem,1.1fr)] md:px-[8vw] md:pb-8 md:pt-[9vw]" aria-labelledby="hero-title">
          <div className="relative z-10 max-w-[40rem] self-center">
            <p className="mb-6 flex items-center gap-2 text-[.68rem] font-bold uppercase tracking-[.14em] text-coral"><span className="size-[.45rem] bg-coral" /> Your next chapter starts here</p>
            <h1 className="m-0 font-serif text-[clamp(3.5rem,7.4vw,7.6rem)] font-normal leading-[.95] tracking-[-.065em]" id="hero-title">Go somewhere<br /><em className="text-coral">that stays</em> with you.</h1>
            <p className="my-8 max-w-[25rem] text-base leading-[1.7] text-[#becac4]">
              Thoughtful, flexible trip plans built around your time, your budget,
              and the way you actually like to travel.
            </p>
            <a className="inline-flex items-center gap-8 border-b border-coral pb-3 text-[.78rem] font-bold uppercase tracking-[.1em] text-[#f3efe6] no-underline" href="#planner">
              Build my itinerary <span className="text-lg text-coral" aria-hidden="true">↓</span>
            </a>
          </div>
          <div
            className="relative my-12 ml-4 h-[22rem] rotate-[1.5deg] rounded-sm bg-cover bg-center shadow-[0_30px_80px_rgba(0,0,0,.3)] md:-ml-12 md:my-0 md:h-[min(570px,65vh)]"
            style={{ backgroundImage: "linear-gradient(180deg,rgba(16,40,36,.04) 35%,rgba(16,40,36,.62)), url('https://images.unsplash.com/photo-1433087007977-1f3741b5c33d?auto=format&fit=crop&w=1800&q=85')" }}
            aria-label="Turquoise alpine lake framed by dramatic mountains"
            role="img"
          >
            <div className="absolute bottom-8 left-8 font-serif text-lg leading-tight text-white">Somewhere<br /><strong className="text-[1.8rem] font-normal italic">worth finding</strong></div>
            <div className="absolute right-6 top-6 size-[5.7rem] rotate-[-12deg] rounded-full border border-white/70 pt-5 text-center font-serif text-[1.4rem] leading-none text-white">01<br /><span className="font-sans text-[.45rem] tracking-[.15em]">DISCOVER</span></div>
            <span className="absolute bottom-9 right-8 hidden text-[.58rem] font-medium uppercase tracking-[.2em] text-white/85 md:block">Peyto Lake · Canadian Rockies</span>
          </div>
          <div className="static flex justify-between text-[.65rem] uppercase tracking-[.12em] text-[#7e958d] md:absolute md:bottom-8 md:left-[8vw] md:right-[8vw]">
            <span>01 — Start with a feeling</span>
            <span>↓ Scroll to plan</span>
          </div>
        </section>

        <section className="flex flex-col justify-between gap-8 bg-coral px-5 py-10 text-deep md:flex-row md:items-center md:gap-16 md:px-[8vw]" aria-label="Nexora benefits">
          <p className="m-0 font-serif text-2xl leading-[1.05]">Less searching.<br /><strong className="text-[2rem] font-normal italic">More living.</strong></p>
          <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-3 md:max-w-[45rem] md:gap-8">
            <div className="border-l border-deep/35 pl-4"><span className="text-[.65rem] font-bold">01</span><p className="mt-2 max-w-32 text-[.8rem] leading-snug">Built around your budget</p></div>
            <div className="border-l border-deep/35 pl-4"><span className="text-[.65rem] font-bold">02</span><p className="mt-2 max-w-32 text-[.8rem] leading-snug">Made for your exact timeframe</p></div>
            <div className="border-l border-deep/35 pl-4"><span className="text-[.65rem] font-bold">03</span><p className="mt-2 max-w-32 text-[.8rem] leading-snug">One clear plan, start to finish</p></div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[110rem] grid-cols-1 gap-10 px-5 py-20 md:grid-cols-[minmax(13rem,.6fr)_minmax(0,1.4fr)] md:gap-[8vw] md:px-[8vw] md:py-36" id="planner" aria-labelledby="planner-title">
          <div className="pt-4">
            <p className="mb-6 flex items-center gap-2 text-[.68rem] font-bold uppercase tracking-[.14em] text-coral"><span className="size-[.45rem] bg-coral" /> Your trip, your way</p>
            <h2 className="m-0 font-serif text-[clamp(3rem,5vw,5.2rem)] font-normal leading-[.95] tracking-[-.065em] text-[#18302b]" id="planner-title">Where will you<br /><em className="text-coral">go next?</em></h2>
            <p className="mt-7 max-w-[15rem] text-[.9rem] leading-relaxed text-[#687771]">Give us the essentials. We&apos;ll take care of the rabbit holes.</p>
          </div>
          <Planner />
        </section>
      </main>

      <footer className="flex flex-col gap-3 border-t border-[#d6d0c4] px-5 py-6 text-[.7rem] uppercase tracking-[.08em] text-[#687771] sm:flex-row sm:justify-between md:px-[8vw]">
        <span>Nexora</span>
        <span>AI trip plans for curious people.</span>
        <span>Made to wander well.</span>
      </footer>
    </div>
  );
}
