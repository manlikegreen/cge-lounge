"use client";

import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Import placeholder images - replace with actual news images
import heroImg from "@/assets/Home/hero.jpg";
import brandingImg from "@/assets/Home/branding.jpg";
import productImg from "@/assets/Home/productDesignxManagement.jpg";

type NewsItem = {
  id: string;
  imageSrc: string | StaticImageData;
  title: string;
  description: string;
  link: string;
};

const newsItems: NewsItem[] = [
  {
    id: "1",
    imageSrc: heroImg,
    title: "There's a new game trending right now.",
    description:
      "Experience the latest AAA titles with stunning 4K graphics and ray tracing technology, pushing gaming to new heights.",
    link: "#",
  },
  {
    id: "2",
    imageSrc: brandingImg,
    title: "Esports Prize Pools Reach Record Heights in 2024",
    description:
      "Major gaming tournaments are offering unprecedented prize money, with the latest championship boasting a $10 million pool for competitors.",
    link: "#",
  },
  {
    id: "3",
    imageSrc: productImg,
    title: "Next-Gen VR Headsets Promise Revolutionary Gaming",
    description:
      "Leading tech companies unveil cutting-edge VR hardware with enhanced haptic feedback and ultra-high resolution displays for more immersive gaming.",
    link: "#",
  },
  {
    id: "4",
    imageSrc: productImg,
    title: "Cross-Platform Gaming Finally Becomes Universal",
    description:
      "Major publishers agree to implement cross-platform play across all devices, breaking down barriers between console, PC, and mobile gamers.",
    link: "#",
  },
  {
    id: "5",
    imageSrc: productImg,
    title: "AI Companions Transform Single-Player Experiences",
    description:
      "New AI technology creates dynamic NPCs that learn and adapt to player behavior, promising more engaging and personalized story-driven adventures.",
    link: "#",
  },
];

interface NewsCardProps {
  newsItem: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ newsItem }) => {
  return (
    <a
      href={newsItem.link}
      className="group block rounded-xl border border-foreground/20 bg-[#0b1018] overflow-hidden hover:border-brand/30 transition-all duration-300"
    >
      <div className="relative w-full h-48 md:h-56 overflow-hidden">
        <Image
          src={newsItem.imageSrc}
          alt={newsItem.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 md:p-6">
        <h4 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-brand transition-colors line-clamp-2">
          {newsItem.title}
        </h4>
        <p className="text-white/80 text-sm md:text-base leading-relaxed line-clamp-3">
          {newsItem.description}
        </p>
      </div>
    </a>
  );
};

interface NewsUpdatesProps {
  className?: string;
}

const NewsUpdates: React.FC<NewsUpdatesProps> = ({ className }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Function to scroll left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount =
        scrollContainerRef.current.querySelector(".news-card")?.clientWidth ||
        300;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Function to scroll right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount =
        scrollContainerRef.current.querySelector(".news-card")?.clientWidth ||
        300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className={cn("container py-16", className)}>
      <div className="flex items-center justify-between mb-12">
        <h3 className="text-4xl md:text-5xl font-bold text-white">
          News <span className="text-brand-alt">Updates</span>
        </h3>
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60 hover:text-brand transition-all"
            aria-label="Scroll left"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={scrollRight}
            className="grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60 hover:text-brand transition-all"
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div
        className="overflow-x-auto whitespace-nowrap flex gap-6 md:gap-8 scroll-smooth scrollbar-hide"
        ref={scrollContainerRef}
      >
        {newsItems.map((newsItem) => (
          <div
            key={newsItem.id}
            className="news-card flex-shrink-0 w-80 md:w-96"
          >
            <NewsCard newsItem={newsItem} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewsUpdates;
