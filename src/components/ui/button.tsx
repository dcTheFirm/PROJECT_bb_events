import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 hover:from-gray-700 hover:to-gray-800",
        destructive:
          "bg-red-800 text-gray-100 hover:bg-red-900",
        outline:
          "border border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-800 hover:text-gray-100",
        secondary:
          "bg-gray-700 text-gray-200 hover:bg-gray-600",
        ghost: "hover:bg-gray-800 hover:text-gray-100",
        link: "text-gray-300 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref as React.Ref<any>}
          {...props}
        />
      )
    }
    const {
      onDrag, onDragStart, onDragEnd, onDragOver, onDragEnter, onDragLeave, onDrop, draggable,
      onAnimationStart, onAnimationEnd, onAnimationIteration,
      ...rest
    } = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <motion.button
        whileHover={{ scale: 1.06, boxShadow: '0 0 16px #4a90e2' }}
        whileTap={{ scale: 0.98 }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...rest}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
