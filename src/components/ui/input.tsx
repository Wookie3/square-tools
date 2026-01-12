import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-12 w-full border-b-2 border-[var(--ink-black)] bg-[var(--paper-bg)] px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--ink-black)]/40 focus-visible:outline-none focus-visible:bg-[var(--ink-black)]/5 focus-visible:border-b-4 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-mono transition-all",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
