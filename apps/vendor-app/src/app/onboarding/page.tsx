"use client";

import { useOnboarding } from "@/contexts/OnboardingContex"; 
import { useStepGuard } from "@/hooks/useStepGuard";
// import OutletOwnerStep from "./steps/OutletOwnerStep";
// import OwnerEmailOtpStep from "./steps/OwnerEmailOtpStep";
import { OnboardingStep } from "@/types/onboarding";

export default function OnboardingPage() {
  const { step } = useOnboarding();
  useStepGuard();

  switch (step) {
    // case OnboardingStep.OUTLET_OWNER:
    //   return <OutletOwnerStep />;

    // case OnboardingStep.OWNER_EMAIL_OTP:
    //   return <OwnerEmailOtpStep />;

    default:
      return <p>Loading...</p>;
  }
}
