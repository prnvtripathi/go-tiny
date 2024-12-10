"use client";

import { motion } from "framer-motion";
import { Link2, QrCode, BarChart3, Globe } from "lucide-react";
import { useInView } from "../hooks/useInView";

const features = [
  {
    icon: Link2,
    title: "URL Shortening",
    description: "Create concise, shareable links in seconds.",
  },
  {
    icon: QrCode,
    title: "QR Code Generation",
    description: "Generate QR codes for easy mobile access.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track link performance with detailed insights.",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description: "Use your own domain for branded short links.",
  },
];

export function Features() {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Powerful Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <feature.icon className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
