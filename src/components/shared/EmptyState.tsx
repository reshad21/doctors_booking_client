import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  };
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: "h-[40vh] text-sm",
      spacing: "space-y-2",
      iconSize: "w-8 h-8",
      titleSize: "text-sm font-medium",
    },
    md: {
      container: "h-[60vh] text-base",
      spacing: "space-y-3",
      iconSize: "w-12 h-12",
      titleSize: "text-lg font-semibold",
    },
    lg: {
      container: "h-[80vh] text-lg",
      spacing: "space-y-4",
      iconSize: "w-16 h-16",
      titleSize: "text-xl font-semibold",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={cn(
        "flex justify-center items-center bg-white",
        currentSize.container,
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col justify-center items-center text-center max-w-md mx-auto px-4",
          currentSize.spacing
        )}
      >
        {icon && (
          <div
            className={cn(
              "text-muted-foreground flex-shrink-0",
              currentSize.iconSize
            )}
          >
            {icon}
          </div>
        )}

        <div className="space-y-2">
          <h3 className={cn("text-foreground", currentSize.titleSize)}>
            {title}
          </h3>

          {description && (
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || "default"}
            className="mt-2"
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
