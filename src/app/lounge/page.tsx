import React from "react";
import LoungeHero from "@/components/Lounge/LoungeHero";
import GamingEquipment from "@/components/Lounge/GamingEquipment";
import FacilityAmenities from "@/components/Lounge/FacilityAmenities";
import BookingInfo from "@/components/Lounge/BookingInfo";
import LoungeGallery from "@/components/Lounge/LoungeGallery";

const LoungePage = () => {
  return (
    <div className="mt-[10rem]">
      <LoungeHero />
      <GamingEquipment />
      <FacilityAmenities />
      <BookingInfo />
      <LoungeGallery />
    </div>
  );
};

export default LoungePage;
