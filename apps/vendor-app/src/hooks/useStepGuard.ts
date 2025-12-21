import { useEffect } from "react";
import { useOnboarding } from "@/contexts/OnboardingContex";
import { OnboardingStep } from "@/types/onboarding";

export const useStepGuard = () => {
  const { step, data, setStep } = useOnboarding();

  useEffect(() => {
    if (step !== OnboardingStep.MOBILE && !data.mobileOtpVerified) {
      setStep(OnboardingStep.MOBILE_OTP);
    }

    if (
      step === OnboardingStep.TYPE_AND_TIMINGS &&
      !data.owner.emailOtpVerified
    ) {
      setStep(OnboardingStep.OWNER_EMAIL_OTP);
    }
  }, [step, data]);
};
