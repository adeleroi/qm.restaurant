import clsx from "clsx";

export function Section({children, className}: {children: React.ReactNode, className?: string}) {
    return (
        <section className={clsx("grid w-full pt-8", className)}>
            { children }
        </section>
    );
}
