"use client";
import { motion } from "framer-motion";
import { Link } from "next-view-transitions";

export default function DUX() {
  const text = "DUX";

  return (
    <Link href="/">
      <div className="flex min-h-full items-center justify-center ">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 className="text-4xl lg:text-5xl font-extrabold text-blue-600 text-center flex">
            {text.split("").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.2, rotate: 5, color: "#facc15" }} // Hover effect
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>
        </motion.div>
      </div>
    </Link>
  );
}
