import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
    const containerRef = useRef(null);
    const layer0Ref = useRef(null); // BG
    const layer1Ref = useRef(null); // Mountains
    const layer2Ref = useRef(null); // Core
    const layer3Ref = useRef(null); // Foreground
    const textRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                    pin: true,
                },
            });

            // Parallax & Depth Effects
            // Layer 0: Background - subtle movement
            tl.to(layer0Ref.current, { scale: 1.1, y: 50 }, 0);

            // Layer 1: Mountains - zoom in effect
            tl.to(layer1Ref.current, { scale: 1.5, y: 100 }, 0);

            // Layer 2: The Core - rotates and scales up significantly (Transition)
            tl.to(layer2Ref.current, {
                scale: 3,
                y: 200,
                rotation: 45,
                opacity: 0.5
            }, 0);

            // Layer 3: Foreground Spheres - fly past camera
            tl.to(layer3Ref.current, {
                scale: 4,
                y: -300,
                opacity: 0,
                z: 500 // Simulate passing through
            }, 0);

            // Text Parallax
            tl.to(textRef.current, { y: -200, opacity: 0 }, 0);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-screen overflow-hidden flex items-center justify-center">
            {/* Layer 0: Core Background */}
            <img
                ref={layer0Ref}
                src="/assets/layer_0.png"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Layer 1: Mountains */}
            <img
                ref={layer1Ref}
                src="/assets/layer_1.png"
                alt="Mountains"
                className="absolute bottom-0 w-full h-auto z-10"
            />

            {/* Layer 3: Foreground (Behind Hero, but passing camera) */}
            {/* Note: Based on request, this maps to 'Foreground Elements' which should be close to camera */}
            {/* We place it z-30 to fly past */}
            <img
                ref={layer3Ref}
                src="/assets/layer_3.png"
                alt="Foreground UI"
                className="absolute w-full h-full object-cover z-30 mix-blend-screen"
            />

            {/* Layer 2: The Core (Monolith) */}
            <div
                ref={layer2Ref}
                className="absolute z-20 w-64 h-64 md:w-96 md:h-96 flex items-center justify-center"
            >
                <img
                    src="/assets/layer_2.png"
                    alt="The Core"
                    className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(0,242,255,0.6)]"
                />
            </div>



            {/* Hero Content */}
            <div ref={textRef} className="relative z-40 text-center px-4 mix-blend-overlay">
                <h1 className="font-header text-6xl md:text-8xl font-bold tracking-tighter text-white mb-4 drop-shadow-lg">
                    SCALING BEYOND<br />THE HORIZON
                </h1>
                <p className="font-sans text-xl md:text-2xl text-electric-cyan tracking-widest uppercase">
                    Neo-Strat Digital Agency
                </p>
            </div>

            {/* Overlay to blend bottom */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-deep-space to-transparent z-50"></div>
        </div>
    );
}
