import { useEffect, useRef } from 'react';
import { MotionValue, useTransform } from 'framer-motion';

interface HeroCanvasProps {
    scrollYProgress: MotionValue<number>;
}

const FRAME_COUNT = 140;

const preloadedImages: HTMLImageElement[] = [];
let imagesStartedLoading = false;

function preloadImages() {
    if (imagesStartedLoading) return;
    imagesStartedLoading = true;
    for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        img.decoding = 'async';
        const frameIndex = i.toString().padStart(3, '0');
        img.src = `/hero-sequence/ezgif-frame-${frameIndex}.jpg`;
        preloadedImages.push(img);
    }
}

if (typeof window !== 'undefined') {
    preloadImages();
}

function renderImageToCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement) {
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

export function HeroCanvas({ scrollYProgress }: HeroCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);
    const lastFrameRef = useRef<number>(-1);

    const canvasOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [1, 0.8, 0.6, 0.5]);
    const overlayOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.1, 0.3, 0.5, 0.7]);

    // Size canvas once + on resize
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            lastFrameRef.current = -1; // force re-render
        };

        window.addEventListener('resize', resize);
        resize();
        return () => window.removeEventListener('resize', resize);
    }, []);

    // Scroll-driven frame rendering via rAF
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const renderFrame = () => {
            const latest = scrollYProgress.get();
            const frameIndex = Math.min(
                FRAME_COUNT - 1,
                Math.max(0, Math.floor(latest * FRAME_COUNT))
            );

            if (frameIndex !== lastFrameRef.current) {
                const img = preloadedImages[frameIndex];
                if (img?.complete && img.naturalWidth > 0) {
                    renderImageToCanvas(ctx, canvas, img);
                    lastFrameRef.current = frameIndex;
                }
            }

            rafRef.current = requestAnimationFrame(renderFrame);
        };

        rafRef.current = requestAnimationFrame(renderFrame);

        return () => cancelAnimationFrame(rafRef.current);
    }, [scrollYProgress]);

    // Apply motion styles via direct DOM updates for performance
    useEffect(() => {
        const canvas = canvasRef.current;
        const overlay = canvas?.parentElement?.querySelector('[data-overlay]') as HTMLElement | null;

        const unsubCanvas = canvasOpacity.on('change', (v) => {
            if (canvas) canvas.style.opacity = String(v);
        });
        const unsubOverlay = overlayOpacity.on('change', (v) => {
            if (overlay) overlay.style.opacity = String(v);
        });

        return () => { unsubCanvas(); unsubOverlay(); };
    }, [canvasOpacity, overlayOpacity]);

    return (
        <div className="fixed inset-0 z-[-1] bg-black pointer-events-none">
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ willChange: 'opacity' }}
            />
            <div
                data-overlay
                className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"
                style={{ willChange: 'opacity' }}
            />
        </div>
    );
}