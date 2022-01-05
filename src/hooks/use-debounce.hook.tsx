import { useEffect, useState } from "react";

/**
 * Returns provided value, debounced by provider delay.
 * Observes provided value and returns it after enough time is passed.
 * @param value Value provided
 * @param delay Delay to debounce
 */
export function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(
        () => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => {
                clearTimeout(handler);
            };
        }, [value, delay]);

    return debouncedValue;
}