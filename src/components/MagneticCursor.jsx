import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function MagneticCursor() {
    const cursorRef = useRef(null);
    const cursorInnerRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    // Track current magnetic target
    const targetRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const cursorInner = cursorInnerRef.current; // The visual dot/circle

        // GSAP QuickSetters for performance
        const xTo = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3.out" });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3.out" });

        // Mouse position storage
        let mouseX = 0;
        let mouseY = 0;

        const moveCursor = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // If hovering a magnetic target, calculate "magnetic pull"
            if (targetRef.current) {
                const rect = targetRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Attraction strength (0 = locked to center, 1 = follows mouse)
                // We want it to stick to center but pull slightly towards mouse
                const attraction = 0.3;

                const destX = centerX + (mouseX - centerX) * attraction;
                const destY = centerY + (mouseY - centerY) * attraction;

                xTo(destX);
                yTo(destY);
            } else {
                // Normal follow
                xTo(mouseX);
                yTo(mouseY);
            }
        };

        const handleMouseOver = (e) => {
            const target = e.target.closest('a, button, .magnetic');
            if (target && target !== targetRef.current) {
                targetRef.current = target;
                setIsHovering(true);

                // ZOOM EFFECT: Scale the target text/button
                gsap.to(target, { scale: 1.1, duration: 0.3, ease: "power2.out" });

                // Expand Cursor
                gsap.to(cursorInner, {
                    scale: 3, // Make cursor bigger acting like a lens/highlight
                    backgroundColor: 'transparent',
                    borderWidth: '1px',
                    duration: 0.3
                });
            }
        };

        const handleMouseOut = (e) => {
            const target = e.target.closest('a, button, .magnetic');
            // If leaving the stored target
            if (target && target === targetRef.current) {
                // RESET EFFECT
                gsap.to(target, { scale: 1, duration: 0.3, ease: "power2.out" });

                targetRef.current = null;
                setIsHovering(false);

                // Reset Cursor
                gsap.to(cursorInner, {
                    scale: 1,
                    backgroundColor: 'white',
                    borderWidth: '0px',
                    duration: 0.3
                });
            }
        };

        window.addEventListener("mousemove", moveCursor);
        // Use capture to ensuring we catch events before stopPropagation if any
        window.addEventListener("mouseover", handleMouseOver, true);
        window.addEventListener("mouseout", handleMouseOut, true);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver, true);
            window.removeEventListener("mouseout", handleMouseOut, true);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-4 h-4 pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        >
            <div
                ref={cursorInnerRef}
                className="w-full h-full bg-white rounded-full border border-white"
            ></div>
        </div>
    );
}
