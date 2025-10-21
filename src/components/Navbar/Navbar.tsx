"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { ReactNode, useRef, useState } from "react";
import Wrapper from "../UI/Wrapper";
import Link from "next/link";
// import Image from "next/image";
import AnimationContainer from "../UI/AnimationContainer";
// import { useClickOutside } from "@/hooks/use-click-outside";
import { cn } from "@/lib/utils";
// import logo from "@/assets/Logo/android-chrome-512x512.png";
import { MdClose, MdMenu } from "react-icons/md";
import { Button } from "../UI/Button";
import HomeIcon from "../Icons/HomeIcon";
import About from "../Icons/About";
import Services from "../Icons/Services";
import Contact from "../Icons/Contact";
import DashboardIcon from "../Icons/DashboardIcon";

interface AltNavbarProps {
  children?: ReactNode;
}

const AltNavbar: React.FC<AltNavbarProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  //   const mobileMenuRef = useClickOutside(() => {
  //     if (open) setOpen(false);
  //   });

  return (
    <>
      <header className="fixed w-full top-0 inset-x-0 z-50">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 40,
          }}
          style={{
            minWidth: "800px",
          }}
          className="hidden xl:flex bg-background/60 py-2 border border-t-foreground/20 border-b-foreground/10 border-x-foreground/15 rounded-xl self-start items-center justify-between relative z-[50] mx-auto w-[70%] backdrop-blur shadow-[0_0_20px_0_#333] dark:shadow-[0_0_10px_#b8b8b8]"
        >
          <Wrapper className="flex items-center justify-between lg:px-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="flex items-center gap-2">
                <div className="flex gap-2">
                  {/* <Image src={logo} alt="" width={50} height={50} /> */}
                  <div className="flex font-bold uppercase justify-center items-center">
                    <p className="text-2xl">CGE Lounge</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            <div className="hidden xl:flex flex-row flex-1 absolute inset-0 items-center justify-center w-max mx-auto gap-x-2 text-muted-foreground font-medium">
              <AnimatePresence>
                {Nav_Links.map((link, index) => (
                  <AnimationContainer
                    key={index}
                    animation="fadeDown"
                    delay={0.1 * index}
                  >
                    <div className="relative">
                      <Link
                        href={link.link}
                        className="hover:text-brand transition-all duration-500 hover:bg-accent rounded-md px-4 py-2"
                      >
                        {link.name}
                      </Link>
                    </div>
                  </AnimationContainer>
                ))}
              </AnimatePresence>
            </div>

            <AnimationContainer animation="fadeLeft" delay={0.1}>
              <div className="flex items-center gap-x-4">
                {/* {user ? (
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
              ) : ( */}
                <Link href="/auth/login">
                  <Button size={"lg"} variant={"secondary"}>
                    Login
                  </Button>
                </Link>
                {/* )} */}
              </div>
            </AnimationContainer>
          </Wrapper>
        </motion.div>

        {/* Mobile */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: 1,
            y: 20,
            borderTopLeftRadius: open ? "0.75rem" : "1rem",
            borderTopRightRadius: open ? "0.75rem" : "1rem",
            borderBottomLeftRadius: open ? "0" : "1rem",
            borderBottomRightRadius: open ? "0" : "1rem",
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 50,
          }}
          className={cn(
            "flex relative bg-background/60 border border-t-foreground/20 border-b-foreground/10 border-x-foreground/15 flex-col rounded-xl xl:hidden w-10/12 justify-between items-center mx-auto py-4 z-50 backdrop-blur shadow-[0_0_20px_0_#333] dark:shadow-[0_0_10px_#b8b8b8]",
            open && "border-transparent"
          )}
        >
          <Wrapper className="flex items-center justify-between lg:px-4">
            <div className="flex items-center justify-between gap-x-4 w-full">
              <AnimationContainer animation="fadeRight" delay={0.1}>
                <Link href="/">
                  <div className="flex gap-2">
                    {/* <Image src={logo} alt="" width={50} height={50} /> */}
                    <div className="hidden md:flex font-bold uppercase justify-center items-center">
                      <p className="text-2xl">CGE Lounge</p>
                    </div>
                  </div>
                </Link>
              </AnimationContainer>

              <AnimationContainer animation="fadeLeft" delay={0.1}>
                <div className="flex items-center justify-center gap-x-4">
                  <Button variant={"secondary"}>
                    <Link href="/auth/login" className="flex items-center">
                      Get started
                    </Link>
                  </Button>
                  {open ? (
                    <MdClose
                      className="text-black text-2xl dark:text-brand-bg"
                      onClick={() => setOpen(!open)}
                    />
                  ) : (
                    <MdMenu
                      className="text-black text-2xl dark:text-brand-bg"
                      onClick={() => setOpen(!open)}
                    />
                  )}
                </div>
              </AnimationContainer>
            </div>
          </Wrapper>

          <AnimatePresence>
            {open && (
              <motion.div
                // ref={mobileMenuRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.3 }}
                className="flex mt-8 rounded-b-xl absolute top-16 inset-x-0 z-50 flex-col items-center justify-center text-center gap-2 w-full px-4 py-8 shadow-xl shadow-neutral-950 bg-brand"
              >
                {Nav_Links.map((navItem, idx: number) => (
                  <AnimationContainer
                    key={`link=${idx}`}
                    animation="fadeRight"
                    delay={0.1 * (idx + 1)}
                    className="w-full"
                  >
                    <Link
                      href={navItem.link}
                      onClick={() => setOpen(false)}
                      className="relative hover:text-brand-bg w-full px-4 py-1 rounded-lg"
                    >
                      <motion.span>
                        <div className="flex gap-2 items-center justify-center text-center">
                          <p>{navItem.icon({})}</p>
                          <p>{navItem.name}</p>
                        </div>
                      </motion.span>
                    </Link>
                  </AnimationContainer>
                ))}
                {/* <AnimationContainer
                  animation="fadeUp"
                  delay={0.5}
                  className="w-full"
                > */}
                {/* {user ? (
                  <Link href="/dashboard" className="w-full">
                    <Button
                      onClick={() => setOpen(false)}
                      variant="default"
                      className="block md:hidden w-full"
                    >
                      Dashboard
                    </Button>
                  </Link>
                ) : ( */}
                {/* <>
                    <Link href="/signin" className="w-full">
                      <Button
                        onClick={() => setOpen(false)}
                        variant="secondary"
                        className="block md:hidden w-full"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" className="w-full">
                      <Button
                        onClick={() => setOpen(false)}
                        variant="default"
                        className="block md:hidden w-full"
                      >
                        Start for free
                      </Button>
                    </Link>
                  </> */}
                {/* )} */}
                {/* </AnimationContainer> */}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </header>
      {children}
    </>
  );
};

interface NavLink {
  name: string;
  link: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
}

const Nav_Links: NavLink[] = [
  { name: "Home", link: "/", icon: HomeIcon },
  { name: "Games", link: "/games", icon: About },
  { name: "Community", link: "/community", icon: Services },
  { name: "Events", link: "/events", icon: Contact },
  { name: "Esports", link: "/esports", icon: DashboardIcon },
];

export default AltNavbar;
