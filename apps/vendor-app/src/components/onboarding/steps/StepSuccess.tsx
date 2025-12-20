import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Mail,
  Phone,
  LayoutDashboard,
  Headphones,
} from "lucide-react";

interface StepSuccessProps {
  outletName: string;
  onGoToDashboard: () => void;
}

export function StepSuccess({ outletName, onGoToDashboard }: StepSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 animate-scale-in">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-12 h-12 text-primary" />
      </div>

      <h2 className="text-3xl font-bold text-foreground mb-3">
        🎉 You're All Set!
      </h2>

      <p className="text-lg text-muted-foreground max-w-md mb-8">
        Congratulations on completing your onboarding for{" "}
        <strong>{outletName}</strong>! We've sent a confirmation email to your
        registered email address. Our team will review your details and get back
        to you shortly.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button size="lg" onClick={onGoToDashboard} className="gap-2">
          <LayoutDashboard className="w-5 h-5" />
          Go to Dashboard
        </Button>
        <Button size="lg" variant="outline" className="gap-2">
          <Headphones className="w-5 h-5" />
          Contact Support
        </Button>
      </div>

      <div className="bg-card rounded-xl p-6 border border-border w-full max-w-sm">
        <h3 className="font-semibold text-foreground mb-4">Need Help?</h3>
        <div className="space-y-3 text-sm">
          <a
            href="mailto:support@marketplace.com"
            className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4" />
            support@marketplace.com
          </a>
          <a
            href="tel:+919999999999"
            className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
          >
            <Phone className="w-4 h-4" />
            +91 99999 99999
          </a>
        </div>
      </div>
    </div>
  );
}
