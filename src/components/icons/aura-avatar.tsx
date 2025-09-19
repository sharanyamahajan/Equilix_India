// src/components/icons/aura-avatar.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const AuraAvatar = ({ aiStatus }: { aiStatus: string }) => {
    const isSpeaking = aiStatus === 'speaking';
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 150);
        }, Math.random() * 5000 + 2000); // Blink every 2-7 seconds
        return () => clearInterval(blinkInterval);
    }, []);

    const idleAnimation = {
        y: [0, -4, 0],
        transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
    };

    return (
        <motion.div
            className="relative w-full h-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            <motion.div
                className="w-full h-full"
                animate={idleAnimation}
            >
                <svg
                    viewBox="0 0 1024 1024"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-lg"
                    aria-labelledby="aura-title aura-desc"
                >
                    <title id="aura-title">Aura, your AI Companion</title>
                    <desc id="aura-desc">A friendly, human-like avatar with soft pastel colors, designed to be calm and approachable.</desc>
                    <defs>
                        <radialGradient id="face-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="30%">
                            <stop stopColor="#F3E8FF" />
                            <stop offset="1" stopColor="#E6D9FF" />
                        </radialGradient>
                        <radialGradient id="hair-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="30%">
                            <stop stopColor="#D6C6E0" />
                            <stop offset="1" stopColor="#C8B4D4" />
                        </radialGradient>
                        <linearGradient id="blush-gradient" x1="0.5" y1="0" x2="0.5" y2="1">
                            <stop stopColor="#F5A9B8" stopOpacity="0.6"/>
                            <stop offset="1" stopColor="#F5A9B8" stopOpacity="0"/>
                        </linearGradient>
                         <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="15" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Head and Body */}
                    <g filter="url(#soft-glow)">
                        <path d="M512 960C688.13 960 832 816.13 832 640V512C832 335.87 688.13 192 512 192C335.87 192 192 335.87 192 512V640C192 816.13 335.87 960 512 960Z" fill="#E6D9FF" />
                        <path d="M512 218C673.54 218 806 348.46 806 510V620C806 781.54 673.54 912 512 912C350.46 912 218 781.54 218 620V510C218 348.46 350.46 218 512 218Z" fill="url(#face-gradient)" />
                    </g>
                    
                    {/* Hair */}
                    <path d="M784 540C784 390.98 661.02 268 512 268C362.98 268 240 390.98 240 540V600H784V540Z" fill="url(#hair-gradient)" />
                    <path d="M512 192C400 192 320 280 320 400C320 430 330 480 340 512H684C694 480 704 430 704 400C704 280 624 192 512 192Z" fill="url(#hair-gradient)" />
                    
                    {/* Blush */}
                    <circle cx="380" cy="560" r="40" fill="url(#blush-gradient)" />
                    <circle cx="644" cy="560" r="40" fill="url(#blush-gradient)" />

                    {/* Eyes */}
                    <g>
                        {/* Eyebrows */}
                        <path d="M370 450 C 390 440, 430 440, 450 450" stroke="#A995B8" strokeWidth="8" fill="none" strokeLinecap="round" />
                        <path d="M574 450 C 594 440, 634 440, 654 450" stroke="#A995B8" strokeWidth="8" fill="none" strokeLinecap="round" />

                        {/* Left Eye */}
                        <g>
                            <motion.path
                                d="M360 510 C 380 535, 420 535, 440 510"
                                fill="#FFFFFF"
                                stroke="#D6C6E0"
                                strokeWidth="4"
                            />
                            <motion.path
                                d="M360 510 C 380 485, 420 485, 440 510"
                                fill="#FFFFFF"
                                stroke="#D6C6E0"
                                strokeWidth="4"
                                animate={{ scaleY: isBlinking ? 0 : 1 }}
                                transition={{ duration: 0.05, delay: 0.05 }}
                                style={{ transformOrigin: "center" }}
                            />
                             <circle cx="400" cy="510" r="14" fill="#6B5B7B" />
                             <circle cx="405" cy="505" r="5" fill="white" fillOpacity="0.7"/>
                        </g>

                        {/* Right Eye */}
                        <g>
                            <motion.path
                                d="M584 510 C 604 535, 644 535, 664 510"
                                fill="#FFFFFF"
                                stroke="#D6C6E0"
                                strokeWidth="4"
                            />
                            <motion.path
                                d="M584 510 C 604 485, 644 485, 664 510"
                                fill="#FFFFFF"
                                stroke="#D6C6E0"
                                strokeWidth="4"
                                animate={{ scaleY: isBlinking ? 0 : 1 }}
                                transition={{ duration: 0.05, delay: 0.05 }}
                                style={{ transformOrigin: "center" }}
                            />
                             <circle cx="624" cy="510" r="14" fill="#6B5B7B" />
                             <circle cx="629" cy="505" r="5" fill="white" fillOpacity="0.7"/>
                        </g>
                    </g>
                    
                    {/* Mouth */}
                    <motion.path
                        d="M482 640 C 502 650, 522 650, 542 640"
                        stroke="#A995B8"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ d: "M492 645 C 502 645, 522 645, 532 645" }}
                        animate={{
                            d: isSpeaking 
                                ? [
                                    "M492 645 C 502 655, 522 655, 532 645", // "ooh"
                                    "M492 642 C 502 642, 522 642, 532 642", // "eeh"
                                    "M492 645 C 502 660, 522 660, 532 645", // "aah"
                                    "M492 645 C 502 655, 522 655, 532 645"
                                ]
                                : "M492 645 C 502 650, 522 650, 532 645" // Smile
                        }}
                        transition={{
                            duration: 0.3,
                            repeat: isSpeaking ? Infinity : 0,
                            ease: "easeInOut"
                        }}
                    />
                </svg>
            </motion.div>
        </motion.div>
    );
};
