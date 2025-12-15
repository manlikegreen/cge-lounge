import Hero from "@/components/Home/Hero";
import heroImg from "@/assets/Home/levelUp.png";
import brandingImg from "@/assets/Home/bookOurFacility.png";
import productImg from "@/assets/Home/exchangeGames.png";
// import UpcomingEvents from "@/components/Home/UpcomingEvents";
import Services from "@/components/Home/Services";
// import NewsUpdates from "@/components/Home/NewsUpdates";
import ContactUs from "@/components/Home/ContactUs";
import UpcomingTournaments from "@/components/Home/UpcomingTournaments";
// import { Button } from "@/components/UI/Button";
// import Image from "next/image";

export default function Home() {
  return (
    <>
      <Hero
        slides={[
          {
            id: "1",
            src: heroImg,
            title: "LEVEL UP YOUR GAME",
            description:
              "Experience the future of gaming at Bonny Island's premier esports lounge. VR adventures, console tournaments, and community events await.",
          },
          {
            id: "2",
            src: brandingImg,
            title: "BOOK OUR FACILITY FOR YOUR EVENTS",
            description:
              "Book our facility for your events. We have a large space for your events. We have a large space for your events. We have a large space for your events. We have a large space for your events. We have a large space for your events. We have a large space for your events. We have a large space for your events. We have a large space for your events. We have a large space for your events. We have a large space for your events. We have a large space for your events. We have a large space for your events. We have a large space for your events.",
          },
          {
            id: "3",
            src: productImg,
            title: "EXCHANGE AND BUY GAMES THROUGH OUR COMMUNITY",
            description:
              "Exchange games with other players through our community. We have a large community of players who are willing to exchange games with other players.",
          },
        ]}
      />
      {/* <UpcomingEvents /> */}
      <UpcomingTournaments />
      <Services />
      {/* <NewsUpdates /> */}
      <ContactUs />
    </>
  );
}
