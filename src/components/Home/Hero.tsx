"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Slide = {
  id: string;
  src: string | StaticImageData;
  alt?: string;
  title?: string;
  description?: string;
};

interface HeroProps {
  slides?: Slide[];
  className?: string;
  autoPlayMs?: number;
}

const defaultSlides: Slide[] = [
  {
    id: "1",
    src: "/window.svg",
    alt: "Slide 1",
    title: "LEVEL UP YOUR GAME",
    description:
      "Experience the future of gaming at Bonny Island's premier esports lounge. VR adventures, console tournaments, and community events await.",
  },
  { id: "2", src: "/next.svg", alt: "Slide 2" },
  { id: "3", src: "/vercel.svg", alt: "Slide 3" },
  { id: "4", src: "/globe.svg", alt: "Slide 4" },
];

export default function Hero({
  slides = defaultSlides,
  className,
  autoPlayMs = 5000,
}: HeroProps) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringRef = useRef(false);

  const numSlides = slides.length;
  const goTo = useCallback(
    (next: number) => {
      setIndex((prev) => {
        const target = typeof next === "number" ? next : prev + 1;
        return (target + numSlides) % numSlides;
      });
    },
    [numSlides]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  const start = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!isHoveringRef.current) {
        setIndex((i) => (i + 1) % numSlides);
      }
    }, autoPlayMs);
  }, [autoPlayMs, numSlides]);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
  };
  const handleMouseLeave = () => {
    isHoveringRef.current = false;
  };

  const dots = useMemo(
    () =>
      slides.map((s, i) => (
        <button
          key={s.id}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => goTo(i)}
          className={cn(
            "h-1.5 w-1.5 rounded-full transition-colors",
            i === index ? "bg-brand" : "bg-foreground/40"
          )}
        />
      )),
    [slides, index, goTo]
  );

  return (
    <section
      className={cn(
        "relative w-full pt-[10rem] pb-[5rem] container",
        className
      )}
    >
      <div className="mx-4 md:mx-8 lg:mx-12">
        <h3 className="text-5xl font-bold text-brand-bg mb-8">
          Latest <span className="text-brand-alt">Updates</span>
        </h3>
        <div className="pb-3 md:pb-4" />

        <div
          className="relative overflow-hidden rounded-xl border border-foreground/20 bg-[#0b1018]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Slides */}
          <div className="relative h-[420px] md:h-[520px] lg:h-[560px]">
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700",
                  i === index ? "opacity-100" : "opacity-0"
                )}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt ?? "slide"}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={i === index}
                />

                {/* Overlay content - only show on larger screens when text is visible */}
                {(slide.title || slide.description) && (
                  <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                )}

                {/* Text content - hidden on mobile and tablet, visible on desktop */}
                <div className="hidden lg:block absolute left-6 right-6 bottom-6 md:left-10 md:right-10 md:bottom-10 text-brand-bg">
                  {slide.title && (
                    <h2 className="text-6xl font-bold tracking-wide drop-shadow">
                      {slide.title}
                    </h2>
                  )}
                  {slide.description && (
                    <p className="mt-4 max-w-4xl text-xl text-brand-bg/90">
                      {slide.description}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Arrows */}
            <button
              aria-label="Previous slide"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-brand-bg hover:bg-black/60 transition"
            >
              ‹
            </button>
            <button
              aria-label="Next slide"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-brand-bg hover:bg-black/60 transition"
            >
              ›
            </button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2">
            {dots}
          </div>
        </div>
      </div>
    </section>
  );
}
