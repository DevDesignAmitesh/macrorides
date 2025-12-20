import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface RadioCardOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface RadioCardProps {
  options: RadioCardOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function RadioCard({
  options,
  value,
  onChange,
  className,
}: RadioCardProps) {
  return (
    <div className={cn("grid gap-4", className)}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200",
              isSelected
                ? "border-primary bg-primary/5 shadow-wizard-card"
                : "border-border bg-card hover:border-primary/40 hover:shadow-wizard-card"
            )}
          >
            {option.icon && (
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-lg",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {option.icon}
              </div>
            )}
            <div className="flex-1">
              <div className="font-semibold text-foreground">
                {option.label}
              </div>
              {option.description && (
                <div className="text-sm text-muted-foreground mt-0.5">
                  {option.description}
                </div>
              )}
            </div>
            <div
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30"
              )}
            >
              {isSelected && <Check className="w-4 h-4" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
