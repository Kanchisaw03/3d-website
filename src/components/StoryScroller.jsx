import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StoryScroller() {
    const lenisRef = useRef(null);

    useEffect(() => {
        // 1. Initialize Lenis
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo Out
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        // 2. Sync GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // 3. Variable Resistance Logic (Narrative Pacing)
        const sections = document.querySelectorAll('section');

        // Default / Base settings
        const baseDuration = 1.2;
        const heavyDuration = 2.5;

        sections.forEach((section, index) => {
            // Hero (Index 0) - Heavy Entry
            // Content (Index 1) - Fluid
            // CTA (Index 2) - Heavy Exit

            let targetDuration = baseDuration;
            if (index === 0) targetDuration = heavyDuration; // Hero
            else if (index === sections.length - 1) targetDuration = heavyDuration; // CTA

            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onEnter: () => {
                    // Apply damping
                    lenis.options.duration = targetDuration;
                },
                onEnterBack: () => {
                    lenis.options.duration = targetDuration;
                }
            });
        });

        // 4. Cleanup
        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf);
        };
    }, []);

    return null; // Logic only component
}
