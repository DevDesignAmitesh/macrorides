import { cn } from "@/lib/utils";

interface MobileProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  className?: string;
}

export function MobileProgressBar({
  currentStep,
  totalSteps,
  stepTitle,
  className,
}: MobileProgressBarProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground">{stepTitle}</span>
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="h-2 bg-wizard-progress-bg rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
