"use client";

import React, { createContext, useContext, useState } from "react";
import { OnboardingStep } from "@/types/onboarding";
import { OnboardingFormData } from "@/types/onboardingForm";

interface Ctx {
  step: OnboardingStep;
  data: OnboardingFormData;
  next: () => void;
  back: () => void;
  update: (data: Partial<OnboardingFormData>) => void;
  setStep: (s: OnboardingStep) => void;
}

const OnboardingContext = createContext<Ctx | null>(null);

export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [step, setStep] = useState(OnboardingStep.MOBILE);
  const [data, setData] = useState<OnboardingFormData>({
    mobileOtpVerified: false,
    outlet: {},
    owner: { emailOtpVerified: false },
  });

  const update = (partial: Partial<OnboardingFormData>) => {
    setData((p) => ({ ...p, ...partial }));
  };

  const steps = Object.values(OnboardingStep);

  const next = () => setStep(steps[steps.indexOf(step) + 1]);
  const back = () => setStep(steps[steps.indexOf(step) - 1]);

  return (
    <OnboardingContext.Provider
      value={{ step, data, next, back, update, setStep }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
export const useOnboarding = () => useContext(OnboardingContext)!;
