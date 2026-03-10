import { useEffect, useRef } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface HeroCanvasProps {
    scrollYProgress: MotionValue<number>;
}

const FRAME_COUNT = 140;

const preloadedImages: HTMLImageElement[] = [];

// Preload images once outside the component
if (typeof window !== 'undefined') {
    for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        const frameIndex = i.toString().padStart(3, '0');
        img.src = `/hero-sequence/ezgif-frame-${frameIndex}.jpg`;
        preloadedImages.push(img);
    }
}

function renderImageToCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

export function HeroCanvas({ scrollYProgress }: HeroCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Dynamically adjust brightness/opacity based on scroll
    // Higher minimum opacity so it remains visible at the end
    const canvasOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [1, 0.8, 0.6, 0.5]);
    const overlayOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.1, 0.3, 0.5, 0.7]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Render logic wrapper
        const render = (img: HTMLImageElement) => renderImageToCanvas(ctx, canvas, img);

        // Initial render
        const initialImg = preloadedImages[0];
        if (initialImg?.complete) {
            render(initialImg);
        } else if (initialImg) {
            initialImg.onload = () => render(initialImg);
        }

        // Scrub animation on scroll
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            const frameIndex = Math.min(
                FRAME_COUNT - 1,
                Math.max(0, Math.floor(latest * FRAME_COUNT))
            );

            const img = preloadedImages[frameIndex];
            if (img && img.complete) {
                render(img);
            }
        });

        return () => unsubscribe();
    }, [scrollYProgress]);

    // Handle Resize
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const frameIndex = Math.min(
                FRAME_COUNT - 1,
                Math.max(0, Math.floor(scrollYProgress.get() * FRAME_COUNT))
            );
            const img = preloadedImages[frameIndex];
            if (img && img.complete) {
                renderImageToCanvas(ctx, canvas, img);
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); // Set initial dimensions before layout effects

        return () => window.removeEventListener('resize', resizeCanvas);
    }, [scrollYProgress]);

    return (
        <div className="fixed inset-0 z-[-1] bg-black pointer-events-none">
            <motion.canvas
                ref={canvasRef}
                style={{ opacity: canvasOpacity }}
                className="w-full h-full object-cover"
            />
            <motion.div
                style={{ opacity: overlayOpacity }}
                className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"
            />
        </div>
    );
}
