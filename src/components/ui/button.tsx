import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 uppercase tracking-widest",
    {
        variants: {
            variant: {
                default:
                    "bg-[var(--ink-black)] text-[var(--paper-bg)] border-2 border-[var(--ink-black)] shadow-[4px_4px_0px_var(--sign-blue)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]",
                destructive:
                    "bg-[var(--sign-red)] text-white border-2 border-[var(--ink-black)] shadow-[4px_4px_0px_var(--ink-black)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]",
                outline:
                    "border-2 border-[var(--ink-black)] bg-transparent text-[var(--ink-black)] shadow-[4px_4px_0px_var(--ink-black)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-[var(--ink-black)] hover:text-[var(--paper-bg)]",
                secondary:
                    "bg-[var(--sign-blue)] text-black border-2 border-[var(--ink-black)] shadow-[4px_4px_0px_var(--ink-black)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]",
                ghost: "hover:bg-[var(--ink-black)]/10 hover:text-[var(--ink-black)] px-0",
                link: "text-[var(--ink-black)] underline-offset-4 hover:underline decoration-[var(--sign-red)] decoration-2 px-0",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 px-4 text-xs",
                lg: "h-12 px-8 text-base",
                icon: "h-11 w-11",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
