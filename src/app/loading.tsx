'use client'

import { motion } from "framer-motion";
import DUX from "@/components/ui/Dux";

const LoadingFullScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
      {/* Logo */}
      <DUX />

      {/* Spinner and Text */}
      <div className="flex flex-col items-center gap-3 mt-4">
        {/* Framer Motion Spinner */}
        <motion.div
          className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />

        {/* Loading Text */}
        <p className="text-lg font-medium text-gray-800">Please Wait...</p>
      </div>
    </div>
  );
};

export default LoadingFullScreen;
