import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProcessSection() {
    const containerRef = useRef(null);
    const lineRef = useRef(null);
    const progressRef = useRef(null);

    const steps = [
        { title: "Initialization", desc: "Setting the strategic coordinates." },
        { title: "Deployment", desc: "Executing high-velocity code delivery." },
        { title: "Optimization", desc: "Refining performance metrics via AI." },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Progress Line Animation
            gsap.to(progressRef.current, {
                height: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top center",
                    end: "bottom center",
                    scrub: 0.5,
                }
            });

            // Steps Animation
            steps.forEach((_, i) => {
                gsap.fromTo(`.step-${i}`,
                    { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 1,
                        scrollTrigger: {
                            trigger: `.step-${i}`,
                            start: "top 80%",
                            end: "top 50%",
                            scrub: 1,
                        }
                    }
                );
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full min-h-screen bg-deep-space py-32 flex flex-col items-center">
            <h2 className="font-header text-4xl md:text-5xl font-bold text-white mb-24 z-10">THE PROTOCOL</h2>

            <div className="relative w-full max-w-4xl px-4">
                {/* Central Line */}
                <div
                    ref={lineRef}
                    className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/10"
                >
                    {/* Active Progress */}
                    <div ref={progressRef} className="w-full bg-electric-cyan shadow-[0_0_15px_#00f2ff]"></div>
                </div>

                {/* Steps */}
                <div className="space-y-32">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className={`step-${i} flex items-center justify-between w-full ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                        >
                            {/* Content Side */}
                            <div className={`w-[45%] ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                <h3 className="font-header text-3xl font-bold text-white mb-2">{step.title}</h3>
                                <p className="font-sans text-slate-gray">{step.desc}</p>
                            </div>

                            {/* Node on Line */}
                            <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-deep-space border-2 border-electric-cyan rounded-full z-10 shadow-[0_0_10px_#00f2ff]"></div>

                            {/* Empty Side for balance */}
                            <div className="w-[45%]"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
