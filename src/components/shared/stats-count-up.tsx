"use client";

import React, { useEffect, useState, useRef } from "react";

interface Stat {
  id: number;
  value: number;
  label: string;
}

interface StatsProps {
  stats: Stat[];
}

const Stats: React.FC<StatsProps> = ({ stats }) => {
  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      { threshold: 0.5 } // Trigger when at least 50% is visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return; // Start animation only when visible

    const intervals = stats.map((stat, index) => {
      const increment = Math.ceil(stat.value / 100);
      let current = 0;

      return setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(intervals[index]);
        }
        setAnimatedValues((prev) => {
          const newValues = [...prev];
          newValues[index] = current;
          return newValues;
        });
      }, 20);
    });

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [isVisible, stats]);

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
      {stats.map((stat, index) => (
        <div key={stat.id} className="flex flex-col items-center">
          <span className="text-4xl md:text-5xl font-bold text-primary mb-2">
            {animatedValues[index].toLocaleString()}+
          </span>
          <span className="text-slate-600">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Stats;
