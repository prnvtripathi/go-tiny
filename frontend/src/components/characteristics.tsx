"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useInView } from "../hooks/useInView";

const characteristics = [
  "Lightning-fast link shortening",
  "Secure and reliable",
  "Mobile-friendly QR codes",
  "Customizable short URLs",
  "Real-time click tracking",
  //   "API access for developers",
  "Team collaboration features",
  //   "99.9% uptime guarantee",
];

export function Characteristics() {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="w-full py-12 md:py-24">
      <div className="px-4 md:px-6">
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Why Choose Us?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {characteristics.map((characteristic, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-3 justify-center p-4 bg-gray-50 dark:bg-stone-900 rounded-lg shadow-md"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400" />
              <span className="text-gray-700 dark:text-gray-200">
                {characteristic}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
