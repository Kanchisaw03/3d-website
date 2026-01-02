import { useRef, useState, useEffect } from 'react';

export default function Navbar() {
    const [activeIndex, setActiveIndex] = useState(0);
    const blobRef = useRef(null);
    const navRef = useRef(null);

    const links = [
        { name: 'QUBITS', href: '#' },
        { name: 'CAPABILITIES', href: '#services' },
        { name: 'CONTACT', href: '#contact' }
    ];

    const handleMouseEnter = (index, e) => {
        setActiveIndex(index);
        if (blobRef.current) {
            // Move blob to the hovered element's position
            const rect = e.target.getBoundingClientRect();
            const navRect = navRef.current.getBoundingClientRect();
            const left = rect.left - navRect.left;
            blobRef.current.style.transform = `translateX(${left}px)`;
            blobRef.current.style.width = `${rect.width}px`;
        }
    };

    // Initialize blob position
    useEffect(() => {
        if (navRef.current && blobRef.current) {
            const firstItem = navRef.current.querySelector('a');
            if (firstItem) {
                const rect = firstItem.getBoundingClientRect();
                const navRect = navRef.current.getBoundingClientRect();
                blobRef.current.style.width = `${rect.width}px`;
                blobRef.current.style.transform = `translateX(${rect.left - navRect.left}px)`;
            }
        }
    }, []);

    return (
        <>
            {/* SVG Filter for Liquid Effect */}
            <svg className="hidden">
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                            result="goo"
                        />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>

            <nav className="fixed top-8 w-full flex justify-center z-50 pointer-events-none">
                <div
                    ref={navRef}
                    className="pointer-events-auto relative bg-black/20 backdrop-blur-2xl border border-white/10 rounded-full px-2 py-2 flex items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
                >
                    {/* The Liquid Container - Apply Filter Here */}
                    {/* We separate the text from the blob to prevent text blurring, or use specific layering */}

                    {/* Background Blob Layer */}
                    <div className="absolute inset-0 rounded-full overflow-hidden" style={{ filter: 'url(#goo)' }}>
                        {/* The Moving Mercury Blob */}
                        <div
                            ref={blobRef}
                            className="absolute top-1/2 -translate-y-1/2 left-0 h-8 bg-white opacity-20 rounded-full transition-all duration-500 ease-in-out mix-blend-overlay"
                            style={{ width: '0px' }} // Initial width set by JS
                        />
                    </div>

                    {/* Navigation Links */}
                    <ul className="relative flex space-x-1 z-10">
                        {links.map((link, index) => (
                            <li key={link.name}>
                                <a
                                    href={link.href}
                                    onMouseEnter={(e) => handleMouseEnter(index, e)}
                                    className={`block px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-colors duration-300 ${index === activeIndex ? 'text-black' : 'text-white/70 hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Active Highlight (Text Inversion Layer for readability) */}
                    <div
                        className="absolute top-2 bottom-2 left-0 bg-white rounded-full transition-all duration-500 ease-in-out -z-10"
                        style={{
                            transform: blobRef.current?.style.transform,
                            width: blobRef.current?.style.width
                        }}
                    />
                </div>
            </nav>
        </>
    );
}
