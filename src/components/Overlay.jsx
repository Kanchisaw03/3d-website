import { forwardRef, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Section = forwardRef(({ children, className = "" }, ref) => (
  <section ref={ref} className={`h-screen w-full flex flex-col justify-center px-8 md:px-24 snap-start ${className}`}>
    {children}
  </section>
));

export default function Overlay() {
  const containerRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Wait for refs
    if (!card1Ref.current || !card2Ref.current || !card3Ref.current) return;

    const cards = [card1Ref.current, card2Ref.current, card3Ref.current];

    // Kill old triggers if any (React strict mode safety)
    ScrollTrigger.getAll().forEach(t => t.kill());

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Desktop: Fan from center
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%", // Start when container top is 75% down viewport
          end: "center center", // End when container center is at viewport center
          scrub: 1
        }
      });

      // Set initial state via GSAP to ensure no FOUC
      gsap.set(cards, { opacity: 0 });

      // Card 1 (Left) - Starts Center, moves Left
      tl.fromTo(card1Ref.current,
        { xPercent: 105, y: 50, z: -100, rotateY: -5, opacity: 0 },
        { xPercent: 0, y: 0, z: 0, rotateY: 0, opacity: 1, duration: 1 }
      )
        // Card 2 (Center) - Starts slightly back
        .fromTo(card2Ref.current,
          { z: -150, scale: 0.9, opacity: 0 },
          { z: 0, scale: 1, opacity: 1, duration: 1 },
          "<" // Sync start
        )
        // Card 3 (Right) - Starts Center, moves Right
        .fromTo(card3Ref.current,
          { xPercent: -105, y: 50, z: -100, rotateY: 5, opacity: 0 },
          { xPercent: 0, y: 0, z: 0, rotateY: 0, opacity: 1, duration: 1 },
          "<"
        );
    });

    mm.add("(max-width: 767px)", () => {
      // Mobile: Vertical Cascade
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "center center",
          scrub: 1
        }
      });

      tl.fromTo(cards,
        { y: 100, opacity: 0, rotateX: 20 },
        { y: 0, opacity: 1, rotateX: 0, stagger: 0.2, duration: 1 }
      );
    });

    // CTA Animation
    if (ctaRef.current) {
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            end: "bottom 90%",
            scrub: 1
          }
        }
      );
    }

    return () => mm.revert();
  }, []);

  return (
    // Height 300vh to define scrollable area for 3 sections
    <div className="relative w-full h-[300vh] text-cold-white pointer-events-none">

      {/* PHASE 1: ENTRY */}
      <Section className="items-start">
        <h1 className="font-header text-6xl md:text-9xl font-bold tracking-tighter uppercase leading-[0.8]" style={{ mixBlendMode: 'difference', color: 'white' }}>
          QUBITS BUILDS<br />WHAT OTHERS CAN’T.
        </h1>
        <div className="mt-8 font-sans text-sm md:text-base text-spectral-silver tracking-widest uppercase border-t border-white/20 pt-4 w-64" style={{ mixBlendMode: 'difference', color: 'white' }}>
          Digital systems engineered for scale, precision, and control.
        </div>
      </Section>

      {/* PHASE 2: PORTAL */}
      <Section className="items-center justify-center">
        {/* Container with perspective for 3D fan effect */}
        <div ref={containerRef} className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 px-4" style={{ perspective: '1500px' }}>

          {/* Card 1 */}
          <div ref={card1Ref} className="h-full transform-gpu will-change-transform">
            <div className="border border-white/20 p-8 h-80 flex flex-col justify-between hover:bg-black/70 transition-colors duration-300 backdrop-blur-xl bg-black/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <h3 className="font-header text-3xl font-bold uppercase">
                Product<br />Engineering
              </h3>
              <p className="font-sans text-sm text-spectral-silver tracking-wide">
                Digital platforms built to perform under real-world pressure.
              </p>
              <div className="w-full h-[1px] bg-white/40"></div>
            </div>
          </div>

          {/* Card 2 */}
          <div ref={card2Ref} className="h-full mt-0 md:mt-12 transform-gpu will-change-transform">
            <div className="border border-white/20 p-8 h-80 flex flex-col justify-between hover:bg-black/70 transition-colors duration-300 backdrop-blur-xl bg-black/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <h3 className="font-header text-3xl font-bold uppercase">
                Experience<br />Design
              </h3>
              <p className="font-sans text-sm text-spectral-silver tracking-wide">
                Interfaces designed with intent and clarity.
              </p>
              <div className="w-full h-[1px] bg-white/40"></div>
            </div>
          </div>

          {/* Card 3 */}
          <div ref={card3Ref} className="h-full mt-0 md:mt-24 transform-gpu will-change-transform">
            <div className="border border-white/20 p-8 h-80 flex flex-col justify-between hover:bg-black/70 transition-colors duration-300 backdrop-blur-xl bg-black/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <h3 className="font-header text-3xl font-bold uppercase">
                Infrastructure<br />& Scale
              </h3>
              <p className="font-sans text-sm text-spectral-silver tracking-wide">
                Systems designed to grow without breaking.
              </p>
              <div className="w-full h-[1px] bg-white/40"></div>
            </div>
          </div>

        </div>
      </Section>

      {/* PHASE 3: CONVERGENCE */}
      <Section className="items-center text-center">
        <h2 className="font-header text-4xl md:text-7xl font-bold mb-12" style={{ mixBlendMode: 'difference', color: 'white' }}>
          Clarity is a<br />competitive advantage.
        </h2>
        <div ref={ctaRef} className="pointer-events-auto inline-block">
          <button className="px-12 py-6 bg-cold-white text-obsidian font-header font-bold text-xl tracking-widest hover:bg-spectral-silver transition-colors duration-300">
            START A PROJECT
          </button>
        </div>
      </Section>
    </div>
  );
}
