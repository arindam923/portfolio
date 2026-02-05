import { type MotionValue, useTransform } from "framer-motion";

export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 15,
        }
    },
};


export function useTransformValue(value: MotionValue<number>, inputRange: number[], outputRange: number[]) {
    return useTransform(value, inputRange, outputRange)
}