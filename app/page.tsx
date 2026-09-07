import { Planner } from "@/app/components/planner";

export default function Home() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#planner" aria-label="Nexora home">
          <span className="brand-mark">N</span>
          <span>Nexora</span>
        </a>
        <p className="header-note">Travel planning, made personal</p>
        <a className="header-link" href="#planner">
          Start planning <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Your next chapter starts here</p>
            <h1 id="hero-title">Go somewhere<br /><em>that stays</em> with you.</h1>
            <p className="hero-intro">
              Thoughtful, flexible trip plans built around your time, your budget,
              and the way you actually like to travel.
            </p>
            <a className="hero-cta" href="#planner">
              Build my itinerary <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-scene" aria-label="A sunny mountain destination" role="img">
            <div className="scene-label">The art of going<br /><strong>somewhere new</strong></div>
            <div className="scene-stamp">01<br /><span>DISCOVER</span></div>
          </div>
          <div className="hero-meta">
            <span>01 — Start with a feeling</span>
            <span>↓ Scroll to plan</span>
          </div>
        </section>

        <section className="intro-strip" aria-label="Nexora benefits">
          <p className="strip-lead">Less searching.<br /><strong>More living.</strong></p>
          <div className="strip-points">
            <div><span>01</span><p>Built around your budget</p></div>
            <div><span>02</span><p>Made for your exact timeframe</p></div>
            <div><span>03</span><p>One clear plan, start to finish</p></div>
          </div>
        </section>

        <section className="planner-section" id="planner" aria-labelledby="planner-title">
          <div className="section-heading">
            <p className="eyebrow dark"><span /> Your trip, your way</p>
            <h2 id="planner-title">Where will you<br /><em>go next?</em></h2>
            <p>Give us the essentials. We&apos;ll take care of the rabbit holes.</p>
          </div>
          <Planner />
        </section>
      </main>

      <footer className="site-footer">
        <span>Nexora</span>
        <span>AI trip plans for curious people.</span>
        <span>Made to wander well.</span>
      </footer>
    </div>
  );
}
