"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/UI/Button";

type Service = {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

const services: Service[] = [
  {
    id: "1",
    title: "VR Gaming",
    description:
      "Step into virtual worlds with our state-of-the-art VR setups. Experience games like never before with immersive 360-degree gameplay.",
    buttonText: "Book Now",
    buttonLink: "#",
  },
  {
    id: "2",
    title: "Console Gaming",
    description:
      "Play the latest titles on PS5, Xbox Series X, and Nintendo Switch. Solo adventures or multiplayer battles - your choice.",
    buttonText: "Book Now",
    buttonLink: "#",
  },
  {
    id: "3",
    title: "Esports Events",
    description:
      "Compete in weekly tournaments, watch live streams, and connect with the gaming community. Prize pools and glory await.",
    buttonText: "Register Now",
    buttonLink: "#",
  },
];

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="flex flex-col rounded-xl border border-foreground/20 bg-brand-ash p-8 text-center hover:border-brand/30 transition-colors">
      <h4 className="text-2xl font-bold text-white mb-4">{service.title}</h4>
      <p className="text-white/80 leading-relaxed mb-6 flex-grow">
        {service.description}
      </p>
      <div className="mt-auto">
        <Button
          variant="ghost"
          className="bg-brand text-brand-bg hover:bg-brand/90 px-6 py-3 font-medium"
        >
          {service.buttonText}
        </Button>
      </div>
    </div>
  );
};

interface ServicesProps {
  className?: string;
}

const Services: React.FC<ServicesProps> = ({ className }) => {
  return (
    <section className={cn("bg-brand-secondary py-20", className)}>
      <div className="container">
        <div className="mb-16">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gaming <span className="text-brand-alt">Services</span>
          </h3>
          <p className="text-white/80 text-lg max-w-3xl leading-relaxed">
            Immerse yourself in cutting-edge gaming experiences designed for
            every type of player
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
