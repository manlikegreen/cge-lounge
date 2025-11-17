"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Images,
  GameController,
  EyeSlash,
  Trophy,
  House,
  Target,
  Laptop,
  Joystick,
  Users,
  Camera,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
}

// Using placeholder images - replace with actual lounge photos
const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: "/api/placeholder/400/300",
    alt: "Gaming Station Setup",
    category: "gaming",
    title: "Premium Gaming Stations",
  },
  {
    id: "2",
    src: "/api/placeholder/400/300",
    alt: "VR Gaming Area",
    category: "vr",
    title: "VR Experience Zone",
  },
  {
    id: "3",
    src: "/api/placeholder/400/300",
    alt: "Tournament Area",
    category: "tournament",
    title: "Esports Tournament Space",
  },
  {
    id: "4",
    src: "/api/placeholder/400/300",
    alt: "Lounge Interior",
    category: "interior",
    title: "Comfortable Lounge Area",
  },
  {
    id: "5",
    src: "/api/placeholder/400/300",
    alt: "Console Gaming",
    category: "console",
    title: "Console Gaming Setup",
  },
  {
    id: "6",
    src: "/api/placeholder/400/300",
    alt: "PC Gaming",
    category: "pc",
    title: "High-End PC Gaming",
  },
  {
    id: "7",
    src: "/api/placeholder/400/300",
    alt: "Arcade Games",
    category: "arcade",
    title: "Classic Arcade Games",
  },
  {
    id: "8",
    src: "/api/placeholder/400/300",
    alt: "Group Gaming",
    category: "group",
    title: "Group Gaming Sessions",
  },
];

const categories = [
  { id: "all", name: "All", icon: Images },
  { id: "gaming", name: "Gaming", icon: GameController },
  { id: "vr", name: "VR", icon: EyeSlash },
  { id: "tournament", name: "Tournaments", icon: Trophy },
  { id: "interior", name: "Interior", icon: House },
  { id: "console", name: "Console", icon: Target },
  { id: "pc", name: "PC", icon: Laptop },
  { id: "arcade", name: "Arcade", icon: Joystick },
  { id: "group", name: "Groups", icon: Users },
];

const GalleryImageCard: React.FC<{
  image: GalleryImage;
  index: number;
  onClick: () => void;
}> = ({ image, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-xl bg-gray-800">
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Camera className="w-10 h-10 text-gray-400" />
            </div>
            <div className="text-sm text-gray-400">{image.title}</div>
          </div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="flex justify-center mb-2">
              <MagnifyingGlass className="w-8 h-8" />
            </div>
            <div className="text-sm font-medium">Click to view</div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mt-3">
        <h3 className="text-sm font-medium text-brand-alt">{image.title}</h3>
      </div>
    </motion.div>
  );
};

const Modal: React.FC<{
  image: GalleryImage | null;
  onClose: () => void;
}> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative max-w-4xl max-h-[90vh] mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Camera className="w-16 h-16 text-gray-400" />
                </div>
                <div className="text-xl text-gray-300">{image.title}</div>
                <div className="text-sm text-gray-400 mt-2">{image.alt}</div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-brand-alt mb-2">
                {image.title}
              </h3>
              <p className="text-gray-400">{image.alt}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const LoungeGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <section className="w-full py-20 bg-gray-900/50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-6">
            <span className="text-white">Lounge </span>
            <span className="text-brand-alt">Gallery</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Take a virtual tour of our amazing gaming lounge. See the
            state-of-the-art equipment, comfortable spaces, and vibrant
            atmosphere that awaits you
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
                selectedCategory === category.id
                  ? "bg-brand-alt text-white"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-brand-alt"
              )}
            >
              <category.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {filteredImages.map((image, index) => (
              <GalleryImageCard
                key={image.id}
                image={image}
                index={index}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-brand/20 to-brand-alt/20 rounded-xl p-8 border border-brand-alt/30">
            <h3 className="text-2xl font-bold text-brand-alt mb-4">
              Ready to Experience It Yourself?
            </h3>
            <p className="text-gray-300 text-lg mb-6">
              Don&apos;t just see it in photos - come and experience the real
              thing!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-brand-alt text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-alt/90 transition-colors"
            >
              Book Your Visit Now
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <Modal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </section>
  );
};

export default LoungeGallery;
