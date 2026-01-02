import { forwardRef } from 'react';

const Section = forwardRef(({ children, className = "" }, ref) => (
  <section ref={ref} className={`h-screen w-full flex flex-col justify-center px-8 md:px-24 snap-start ${className}`}>
    {children}
  </section>
));

export default function Overlay() {
  return (
    // Height 300vh to define scrollable area for 3 sections
    <div className="relative w-full h-[300vh] text-cold-white pointer-events-none">

      {/* PHASE 1: ENTRY */}
      <Section className="items-start">
        <h1 className="font-header text-6xl md:text-9xl font-bold tracking-tighter uppercase leading-[0.8]" style={{ mixBlendMode: 'difference', color: 'white' }}>
          We Architect<br />
          The Undefined
        </h1>
        <div className="mt-8 font-sans text-sm md:text-base text-spectral-silver tracking-widest uppercase border-t border-white/20 pt-4 w-64" style={{ mixBlendMode: 'difference', color: 'white' }}>
          Aether-Corp
        </div>
      </Section>

      {/* PHASE 2: PORTAL */}
      <Section className="items-center justify-center">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 px-4">

          {/* Card 1 */}
          <div className="border border-white/20 p-8 h-80 flex flex-col justify-between hover:bg-black/70 transition-colors duration-300 backdrop-blur-xl bg-black/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
            <h3 className="font-header text-3xl font-bold uppercase">
              System<br />Architecture
            </h3>
            <p className="font-sans text-sm text-spectral-silver tracking-wide">
              Scalable, resilient core structures designed for inevitability.
            </p>
            <div className="w-full h-[1px] bg-white/40"></div>
          </div>

          {/* Card 2 */}
          <div className="border border-white/20 p-8 h-80 flex flex-col justify-between hover:bg-black/70 transition-colors duration-300 backdrop-blur-xl bg-black/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] mt-0 md:mt-12">
            <h3 className="font-header text-3xl font-bold uppercase">
              Neural<br />Interfaces
            </h3>
            <p className="font-sans text-sm text-spectral-silver tracking-wide">
              Direct user-system symbiosis reducing action latency to zero.
            </p>
            <div className="w-full h-[1px] bg-white/40"></div>
          </div>

          {/* Card 3 */}
          <div className="border border-white/20 p-8 h-80 flex flex-col justify-between hover:bg-black/70 transition-colors duration-300 backdrop-blur-xl bg-black/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] mt-0 md:mt-24">
            <h3 className="font-header text-3xl font-bold uppercase">
              Hyper-Scale<br />Infrastructure
            </h3>
            <p className="font-sans text-sm text-spectral-silver tracking-wide">
              Infinite horizontal scaling across all capability domains.
            </p>
            <div className="w-full h-[1px] bg-white/40"></div>
          </div>

        </div>
      </Section>

      {/* PHASE 3: CONVERGENCE */}
      <Section className="items-center text-center">
        <h2 className="font-header text-4xl md:text-7xl font-bold mb-12" style={{ mixBlendMode: 'difference', color: 'white' }}>
          Initialize<br />Sequence
        </h2>
        <button className="pointer-events-auto px-12 py-6 bg-cold-white text-obsidian font-header font-bold text-xl tracking-widest hover:bg-spectral-silver transition-colors duration-300">
          START PROJECT
        </button>
      </Section>
    </div>
  );
}
