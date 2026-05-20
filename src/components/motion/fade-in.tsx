"use client";
import { motion, HTMLMotionProps } from "framer-motion";

interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number;
  duration?: number;
  y?: number;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.35,
  y = 10,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 24,
        delay,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadeInStagger({
  children,
  staggerDelay = 0.07,
  className,
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: staggerDelay } },
      }}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

export function FadeInItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 8 },
        show: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 280, damping: 24 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
