import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  shadow?: boolean;
  hover?: boolean;
}

export default function Card({
  children,
  className,
  shadow = true,
  hover = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-border",
        shadow && "shadow-sm",
        hover && "transition-shadow duration-200 hover:shadow-md cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
