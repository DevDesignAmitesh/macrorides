import { vendorType } from "@repo/types/types";
import { Percent, Info, CheckCircle2 } from "lucide-react";

interface StepCommissionPlanProps {
  vendorType: vendorType | "";
}

export function StepCommissionPlan({ vendorType }: StepCommissionPlanProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 animate-scale-in">
      {/* Icon */}
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Percent className="w-12 h-12 text-primary" />
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-bold text-foreground mb-3">
        Your Commission Plan
      </h2>

      <p className="text-lg text-muted-foreground max-w-md mb-8">
        We believe in complete transparency. Here’s how Macro Rides works with
        our partners.
      </p>

      {/* Main Card */}
      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mb-8 text-left">
        <div className="flex items-start gap-3 mb-4">
          <Info className="w-5 h-5 text-primary mt-0.5" />
          <p className="text-sm text-muted-foreground">
            This commission applies to all{" "}
            <strong>
              {vendorType === "FOOD" ? "food orders" : "clothing orders"}
            </strong>{" "}
            processed via Macro Rides.
          </p>
        </div>

        {/* Commission Highlight */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">
            Platform Commission
          </p>
          <p className="text-4xl font-bold text-primary">17%</p>
        </div>

        {/* Details */}
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
            <span>No onboarding or setup fees</span>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
            <span>Commission is deducted only on successful orders</span>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
            <span>No hidden charges or long-term lock-ins</span>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-sm text-muted-foreground max-w-md">
        By continuing, you acknowledge and agree to this commission structure.
        You’ll be able to view detailed payout breakdowns in your dashboard.
      </p>
    </div>
  );
}
