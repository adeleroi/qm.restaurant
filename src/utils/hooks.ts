import React, { LegacyRef } from "react";

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

interface IntersectionObserverOption {
    root: HTMLElement|null,
    rootMargin?: HTMLElement['style']['margin'],
    threshold: Array<number>, // number mjust be less than or equal to 1,
}

// export function useIntersectionObserverEffect(
//     headerRef: LegacyRef<HTMLDivElement> | undefined,
//     intersectionTargetRef: LegacyRef<HTMLDivElement> | undefined,
//     rootTargetRef: LegacyRef<HTMLDivElement> | undefined,
//     treshold: Array<number>,
//     showHeaderStyle: string,
//     hideHeaderStyle: string,
// ) {
//     // const headerRef = React.useRef<HTMLElement|null>(null);
//     // const intersectionTargetRef = React.useRef<HTMLElement|null>(null);
//     // const rootTargetRef = React.useRef<HTMLElement | null>(null);

//     const callback = React.useCallback((entries: Array<IntersectionObserverEntry>) => {
//         if (headerRef.current) {
//             const entry = entries[0];
//             if (entry.isIntersecting) {
//                 if (entry.intersectionRatio < 0.9) {
//                     headerRef.current.className = showHeaderStyle;
//                 } else {
//                     headerRef.current.className = hideHeaderStyle;
//                 }
//             }
//         }
//     }, [])

//     React.useEffect(() => {
//         const target = intersectionTargetRef.current;
//         if (!target) return;
//         const options = {root: rootTargetRef?.current, threshold: treshold || [0.9, 0.7, 0.3, 0]}
//         const observer = new IntersectionObserver(callback, options)
//         observer.observe(target);
//         return () => { target && observer.unobserve(target) };
//     });

//     return { headerRef, intersectionTargetRef, rootTargetRef }
// }
export function useIntersectionObserverEffect(
    targetRef:  React.MutableRefObject<HTMLElement | null>,
    callBack: IntersectionObserverCallback,
    options: IntersectionObserverOption,
) {
    React.useEffect(() => {
        const target = targetRef.current;
        if (!target) return;
        const observer = new IntersectionObserver(callBack, options)
        observer.observe(target);
        return () => { target && observer.unobserve(target) };
    });
}
