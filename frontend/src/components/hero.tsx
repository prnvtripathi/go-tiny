"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BackgroundLines } from "@/components/ui/background-lines";
import Image from "next/image";
import { Link } from "lucide-react";

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <main className="flex h-screen justify-center items-center">
        <BackgroundLines
          className="flex items-center justify-center w-full flex-col"
          svgOptions={{ duration: 2 }}
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h1
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Simplify Your Links, <br /> Share Them With Ease
                </motion.h1>
                <motion.p
                  className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Why carry around a URL that&apos;s longer than a grocery
                  receipt? Shrink it. Share it. Smile. 😊
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Button size="lg">
                    <Link />
                    Get Started
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.div
                  className="relative w-full h-full"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  animate={{
                    y: [0, -20, 0], // Up and down motion
                  }}
                  transition={{
                    duration: 3, // Duration for one complete cycle
                    repeat: Infinity, // Infinite looping
                    ease: "easeInOut", // Smooth easing
                  }}
                >
                  <motion.div
                    className="w-full h-auto"
                    initial={{ rotate: 0, scale: 1 }}
                    animate={{
                      rotate: isHovered ? 5 : 0,
                      scale: isHovered ? 1.1 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    <Image
                      src={"/images/heromain.svg"}
                      width={500}
                      height={500}
                      alt="Hero Image"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </BackgroundLines>
      </main>
    </>
  );
}
