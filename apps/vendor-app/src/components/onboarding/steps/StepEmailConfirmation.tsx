import { Input } from "@/components/ui/input";
import { MailCheck, Clock, ShieldCheck } from "lucide-react";

interface StepEmailConfirmationProps {
  email: string;
  onEmailChange: (email: string) => void;
}

export function StepEmailConfirmation({
  email,
  onEmailChange,
}: StepEmailConfirmationProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 animate-scale-in">
      {/* Icon */}
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <MailCheck className="w-12 h-12 text-primary" />
      </div>

      <h2 className="text-3xl font-bold text-foreground mb-3">
        Almost There 🚀
      </h2>

      <p className="text-lg text-muted-foreground max-w-md mb-8">
        Thank you for your patience. This is the <strong>final step</strong> to
        confirm your vendor registration. Please confirm your email address so
        we can send you the account creation and verification updates.
      </p>

      {/* Info box */}
      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mb-8 text-left">
        <div className="space-y-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
            <span>
              Your vendor account has already been <strong>created</strong>.
            </span>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary mt-0.5" />
            <span>
              Our team is reviewing your details. Verification usually takes{" "}
              <strong>24–48 hours</strong>.
            </span>
          </div>

          <div className="flex items-start gap-3">
            <MailCheck className="w-5 h-5 text-primary mt-0.5" />
            <span>
              You’ll receive a confirmation email today and another email once
              your account is verified.
            </span>
          </div>
        </div>
      </div>

      {/* Email input */}
      <div className="w-full max-w-md space-y-4">
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>

      <p className="text-sm text-muted-foreground max-w-md mt-6">
        Make sure this email is active. All further updates will be sent here.
      </p>
    </div>
  );
}
