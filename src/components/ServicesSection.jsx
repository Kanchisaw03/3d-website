import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
    const containerRef = useRef(null);
    const card1Ref = useRef(null);
    const card2Ref = useRef(null);
    const card3Ref = useRef(null);
    const titleRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top", // Start when section hits top
                    end: "+=150%", // Pin for 1.5 screen heights
                    scrub: 1,
                    pin: true,
                },
            });

            // Title fades in
            tl.fromTo(titleRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 });

            // Cards emerge from center (simulating Monolith splitting)
            // Initial state is centered and invisible
            // Final state is spread out
            tl.fromTo([card1Ref.current, card2Ref.current, card3Ref.current],
                {
                    y: 200,
                    scale: 0.5,
                    opacity: 0,
                    x: 0
                },
                {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 2,
                    stagger: 0.2
                }
            );

            // Spread cards
            tl.to(card1Ref.current, { x: -350, rotation: -5 }, "<+=0.5"); // Left
            tl.to(card3Ref.current, { x: 350, rotation: 5 }, "<"); // Right
            // Card 2 stays in center

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-deep-space overflow-hidden flex flex-col items-center justify-center">

            {/* Background Elements to bridge transition */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-deep-space z-0"></div>

            <div ref={titleRef} className="z-10 mb-12 text-center">
                <h2 className="font-header text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                    SYSTEM ARCHITECTURE
                </h2>
            </div>

            <div className="relative w-full h-full max-w-6xl mx-auto z-10">
                <Card
                    refProp={card1Ref}
                    title="Brand Identity"
                    icon="◈"
                    color="text-electric-cyan"
                />
                <Card
                    refProp={card2Ref}
                    title="Full-Stack Dev"
                    icon="{ }"
                    color="text-purple-400"
                />
                <Card
                    refProp={card3Ref}
                    title="Growth Marketing"
                    icon="▲"
                    color="text-emerald-400"
                />
            </div>
        </div>
    );
}

const Card = ({ refProp, title, icon, color }) => (
    <div
        ref={refProp}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 rounded-2xl p-6 flex flex-col items-center justify-center gap-6 backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all hover:bg-white/10"
    >
        <div className={`text-6xl ${color} drop-shadow-[0_0_15px_rgba(0,242,255,0.4)]`}>
            {icon}
        </div>
        <h3 className="font-header text-2xl font-bold text-white text-center uppercase tracking-wide">
            {title}
        </h3>
        <p className="font-sans text-sm text-slate-gray text-center leading-relaxed">
            Next-gen infrastructure for scalable digital ecosystems.
        </p>
    </div>
);
