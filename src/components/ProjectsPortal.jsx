import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    { id: 1, title: 'Nebula', category: 'Finance', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000' },
    { id: 2, title: 'Quantum', category: 'AI Interface', img: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1000' },
    { id: 3, title: 'Velocity', category: 'Automotive', img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000' },
    { id: 4, title: 'Echo', category: 'Audio Stream', img: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=1000' },
];

export default function ProjectsPortal() {
    const containerRef = useRef(null);
    const triggerRef = useRef(null);
    const textRef = useRef(null);
    const cardsRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top top",
                    end: "+=400%", // 4x viewport height duration
                    pin: true,
                    scrub: 1.5, // Heavy, smooth scrub
                }
            });

            // PHASE 1: ZOOM IN (Enter the Portal)
            // Optimized: Scale 15 (Performance friendly), No Blur
            tl.fromTo(textRef.current,
                { scale: 1, opacity: 1, z: 0 },
                { scale: 15, opacity: 0, z: 500, duration: 2, ease: "power2.inOut" }
            )

                // PHASE 2: TRANSITION & REVEAL
                // As text fades out, cards emerge from the depth
                .fromTo(cardsRef.current,
                    { y: '30%', opacity: 0, scale: 0.8 }, // Start slightly lower/smaller
                    { y: '0%', opacity: 1, scale: 1, duration: 2, ease: "power2.out" },
                    "-=0.5" // Start revealing just as text dissolves
                );

        }, triggerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={triggerRef} className="relative w-full h-screen overflow-hidden perspective-1000">
            {/* Background Grain/Fog handled globally, but we can add local depth */}

            {/* PHASE 1: Portal Text */}
            <div ref={containerRef} className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <h1
                    ref={textRef}
                    className="text-[15vw] font-black text-white tracking-tighter leading-none"
                    style={{ willChange: 'transform, opacity' }}
                >
                    PROJECTS
                </h1>
            </div>

            {/* PHASE 2: Projects Grid */}
            <div
                ref={cardsRef}
                className="absolute inset-0 z-10 w-full h-full flex items-center justify-center px-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl w-full">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className={`group relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 border border-white/10 ${index % 2 !== 0 ? 'md:translate-y-12' : ''}`}
                        >
                            {/* Image */}
                            <img
                                src={project.img}
                                alt={project.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <span className="text-xs font-mono text-cyan-400 mb-2 block tracking-widest uppercase">
                                    {project.category}
                                </span>
                                <h3 className="text-3xl font-bold text-white mb-2">{project.title}</h3>
                                <div className="h-[1px] w-full bg-white/20 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
