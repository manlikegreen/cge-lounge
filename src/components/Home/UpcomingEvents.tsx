"use client";

import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/UI/Button";

// Import placeholder images - replace with actual event images
import heroImg from "@/assets/Home/hero.jpg";
import brandingImg from "@/assets/Home/branding.jpg";
import productImg from "@/assets/Home/productDesignxManagement.jpg";

type Event = {
  id: string;
  imageSrc: string | StaticImageData;
  title: string;
  description: string;
  date: string;
  buttonText: string;
  buttonLink: string;
};

const events: Event[] = [
  {
    id: "1",
    imageSrc: heroImg,
    title: "Console Challenge",
    description: "Battle royale tournament with $5,000 prize pool",
    date: "Dec 15, 2025",
    buttonText: "Watch Live",
    buttonLink: "#",
  },
  {
    id: "2",
    imageSrc: brandingImg,
    title: "FIFA Friday Nights",
    description: "Weekly soccer gaming tournament for all skill levels",
    date: "Dec 15, 2025",
    buttonText: "Register",
    buttonLink: "#",
  },
  {
    id: "3",
    imageSrc: productImg,
    title: "VR Racing League",
    description: "Virtual reality racing championship series",
    date: "Dec 15, 2025",
    buttonText: "Join Weekly",
    buttonLink: "#",
  },
  {
    id: "4",
    imageSrc: heroImg,
    title: "PUBG Club",
    description: "Battle royale tournament with $5,000 prize pool",
    date: "Dec 15, 2025",
    buttonText: "Register",
    buttonLink: "#",
  },
  {
    id: "5",
    imageSrc: brandingImg,
    title: "Guardians night",
    description: "Weekly soccer gaming tournament for all skill levels",
    date: "Dec 15, 2025",
    buttonText: "Register",
    buttonLink: "#",
  },
  {
    id: "6",
    imageSrc: productImg,
    title: "Uncharted 4 game",
    description: "Virtual reality racing championship series",
    date: "Dec 15, 2025",
    buttonText: "Register",
    buttonLink: "#",
  },
];

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="flex flex-col rounded-xl border border-foreground/20 bg-[#0b1018] overflow-hidden hover:border-brand/30 transition-colors">
      <div className="relative w-full h-40 md:h-48">
        <Image
          src={event.imageSrc}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h4 className="text-xl font-bold text-white mb-2">{event.title}</h4>
        <p className="text-sm text-white/80 mb-3 flex-grow leading-relaxed">
          {event.description}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-sm text-white/60 font-medium">
            {event.date}
          </span>
          <Button
            variant="default"
            size="default"
            className="bg-brand text-brand-bg hover:bg-brand/90 px-4 py-2 text-sm font-medium"
          >
            {event.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface UpcomingEventsProps {
  className?: string;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ className }) => {
  return (
    <section className={cn("container py-[5rem]", className)}>
      <div className="mb-12">
        <h3 className="text-5xl font-bold text-white mb-2">
          Upcoming <span className="text-brand-alt">Events</span>
        </h3>
        <p className="text-white/80 text-lg">
          Don&apos;t miss out on the action
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
};

export default UpcomingEvents;
