"use client"

import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "./ui/button";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
    return (
        <>
            <main className="flex h-screen justify-center items-center">
                <BackgroundLines className="flex items-center justify-center w-full flex-col" svgOptions={{ duration: 2 }}>
                    <section className="relative z-20 flex flex-col-reverse md:flex-row items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: -120 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6 flex flex-col items-center md:items-start">
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl lg:text-7xl text-center md:text-left font-sans font-bold tracking-tight max-w-3xl">
                                    Make Long Links Go <span className="text-primary">Bye-Bye</span><span className="text-accent">🚀</span>
                                </h2>
                                <p className="max-w-xl text-sm md:text-lg text-center md:text-left text-neutral-700 dark:text-neutral-400">
                                    Why carry around a URL that&apos;s longer than a grocery receipt? Shrink it. Share it. Smile. <span className="text-accent">😊</span>
                                </p>
                            </div>

                            <Button variant="default" className="font-sans" asChild>
                                <Link href="/dashboard">
                                    <LinkIcon />Shrink My Link
                                </Link>
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 120 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="md:w-1/3">
                            <Image src="/images/hero.svg" alt="Illustration of a production line" className="" width={1000} height={1000} />
                        </motion.div>
                    </section>
                </BackgroundLines>
            </main>
        </>
    )
}