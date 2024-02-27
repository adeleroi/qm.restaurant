import React from "react";

export function useRelativeResize(
    targetRef: React.MutableRefObject<HTMLElement | null>,
    toResizeRef: React.MutableRefObject<HTMLElement | null>,
) {
    React.useEffect(() => {
        const target = targetRef.current;
        const targetToResize = toResizeRef.current;
        if (!target || !targetToResize) return;

        const resizeObser = new ResizeObserver((entries: Array<ResizeObserverEntry>) => {
            const entry = entries[0];
            const { width, left } = entry.target.getBoundingClientRect();
            targetToResize.style.left = `${left}px`;
            targetToResize.style.width = `${width}px`;
        });

        resizeObser.observe(target);
        return () => resizeObser.unobserve(target);
    })
}