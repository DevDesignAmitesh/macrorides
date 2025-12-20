import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
  className?: string;
}

export function StepIndicator({
  steps,
  currentStep,
  onStepClick,
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        const isClickable = step.id < currentStep;

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => isClickable && onStepClick(step.id)}
            disabled={!isClickable}
            className={cn(
              "flex items-start gap-4 w-full p-3 rounded-xl text-left transition-all duration-200",
              isClickable && "hover:bg-accent cursor-pointer",
              isCurrent && "bg-accent",
              !isClickable && !isCurrent && "cursor-default"
            )}
          >
            <div
              className={cn(
                "wizard-step-indicator flex-shrink-0 mt-0.5",
                isCompleted && "wizard-step-completed",
                isCurrent && "wizard-step-current",
                !isCompleted && !isCurrent && "wizard-step-upcoming"
              )}
            >
              {isCompleted ? <Check className="w-5 h-5" /> : step.id}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={cn(
                  "font-semibold text-sm truncate",
                  isCurrent || isCompleted
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.title}
              </div>
              {step.description && (
                <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {step.description}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
