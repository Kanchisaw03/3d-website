import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TEAM = [
    {
        name: "ALEXA M.",
        role: "SYSTEMS ARCHITECT",
        desc: "Redefining the boundaries of computational logic for enterprise scale."
    },
    {
        name: "DAVID K.",
        role: "LEAD ENGINEER",
        desc: "Building the impossible, one line of high-performance code at a time."
    },
    {
        name: "SARAH L.",
        role: "DESIGN DIRECTOR",
        desc: "Synthesizing chaos into pure visual clarity and intuitive interaction."
    },
    {
        name: "JAMES R.",
        role: "STRATEGY",
        desc: "Mapping the future of digital ecosystems with data-driven precision."
    },
    {
        name: "KAI V.",
        role: "CREATIVE TECHNOLOGIST",
        desc: "Bridging the gap between raw code and human emotion."
    }
];

export default function AboutSplit() {
    const containerRef = useRef(null);
    const rightColRef = useRef(null);

    useLayoutEffect(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            // Pin the entire section
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=450%", // Long pin for reading
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1
                }
            });

            // Calculate distance to scroll the right column
            // Use scrollHeight to ensure we traverse the entire list including gaps
            const scrollDistance = rightColRef.current.scrollHeight - window.innerHeight + 100;

            if (scrollDistance > 0) {
                tl.to(rightColRef.current, {
                    y: -scrollDistance,
                    ease: "none"
                });
            }
        });

        return () => mm.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative w-full h-screen overflow-hidden text-cold-white flex flex-col md:flex-row pointer-events-auto">

            {/* Left Column - Static Content */}
            {/* Added mix-blend-mode difference to text elements */}
            <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-8 md:px-24">
                <h6 className="font-sans text-xs tracking-[0.2em] text-spectral-silver mb-8 uppercase">
                    The Collective
                </h6>
                <h2 className="font-header text-5xl md:text-7xl font-bold uppercase mb-8 leading-tight tracking-tight text-white">
                    About<br />Qubits.
                </h2>
                <div className="w-12 h-[1px] bg-white mb-8"></div>
                <p className="font-sans text-spectral-silver text-lg md:text-xl max-w-md leading-relaxed">
                    We are a high-end technology firm focused on scalable, future-ready digital solutions.
                    Operating at the edge of possibility, we engineer intelligence into every system we build.
                </p>
            </div>

            {/* Right Column - Scrolling Content */}
            <div className="w-full md:w-1/2 h-full relative overflow-hidden flex items-start justify-center">
                <div ref={rightColRef} className="flex flex-col gap-[40vh] pt-[50vh] pb-[20vh] px-12 md:px-24 w-full">
                    {TEAM.map((member, i) => (
                        <div key={i} className="team-item flex flex-col gap-4 group p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors duration-500">
                            <div className="flex items-baseline justify-between border-b border-white/20 pb-4 group-hover:border-white/60 transition-colors duration-500">
                                <h3 className="font-header text-3xl font-bold text-white">{member.name}</h3>
                                <span className="font-sans text-xs tracking-widest text-spectral-silver uppercase">{member.role}</span>
                            </div>
                            <p className="font-sans text-sm text-white/60 max-w-sm leading-relaxed group-hover:text-white/90 transition-colors duration-500">
                                {member.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Absolute gradients for masking (only visible if needed, kept generic/transparent) */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-transparent pointer-events-none z-20"></div>

        </section>
    );
}
