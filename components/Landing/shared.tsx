"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

/** Imperative API exposed by every icon in components/animated-icons */
export type IconHandle = { startAnimation: () => void; stopAnimation: () => void };

export type AnimatedIcon = React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & { size?: number } & React.RefAttributes<IconHandle>
>;

/**
 * Renders an animated icon whose animation is driven by the `play` prop,
 * so a parent (button, card, row) can play it when the whole target is hovered.
 */
export function PlayIcon({
  icon: Icon,
  play,
  ...rest
}: { icon: AnimatedIcon; play: boolean; size?: number; className?: string }) {
  const ref = useRef<IconHandle>(null);
  useEffect(() => {
    if (play) ref.current?.startAnimation();
    else ref.current?.stopAnimation();
  }, [play]);
  return <Icon ref={ref} {...rest} />;
}

/** Hover/focus state plus the handlers to spread on the trigger element. */
export function useHover() {
  const [hovered, setHovered] = useState(false);
  const on = useCallback(() => setHovered(true), []);
  const off = useCallback(() => setHovered(false), []);
  return [hovered, { onMouseEnter: on, onMouseLeave: off, onFocus: on, onBlur: off }] as const;
}

/** True for a short moment after the element first scrolls into view. */
export function useViewPulse(ref: React.RefObject<HTMLElement | null>, delay = 250) {
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const on = setTimeout(() => setPulse(true), delay);
    const off = setTimeout(() => setPulse(false), delay + 1400);
    return () => {
      clearTimeout(on);
      clearTimeout(off);
    };
  }, [inView, delay]);
  return pulse;
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 20 },
  },
};

export const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** A number that springs to its new value instead of jumping. */
export function AnimatedNumber({
  value,
  format = (v: number) => inr.format(v),
  className,
}: {
  value: number;
  format?: (v: number) => string;
  className?: string;
}) {
  const spring = useSpring(value, { stiffness: 140, damping: 22 });
  const text = useTransform(spring, (v) => format(Math.round(v)));
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  return <motion.span className={className}>{text}</motion.span>;
}

/** Accent text colour with enough contrast on the cream light theme. */
export const ACCENT_TEXT = "text-emerald-700 dark:text-emerald-400";

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  center?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
      className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}
    >
      <motion.p
        variants={fadeUp}
        className={`mb-3 text-xs font-semibold uppercase tracking-[0.18em] ${ACCENT_TEXT}`}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
