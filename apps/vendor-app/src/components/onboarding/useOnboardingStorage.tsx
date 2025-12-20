import { useEffect, useState, useCallback } from "react";
import { VendorOnboardingData, initialOnboardingData } from "./types";

const STORAGE_KEY = "vendor_onboarding_data";
const STEP_KEY = "vendor_onboarding_step";

export function useOnboardingStorage() {
  const [data, setData] = useState<VendorOnboardingData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load onboarding data:", e);
    }
    return initialOnboardingData;
  });

  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const stored = localStorage.getItem(STEP_KEY);
      if (stored) {
        return parseInt(stored, 10);
      }
    } catch (e) {
      console.error("Failed to load current step:", e);
    }
    return 1;
  });

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setLastSaved(new Date());
    } catch (e) {
      console.error("Failed to save onboarding data:", e);
    }
  }, [data]);

  // Save current step
  useEffect(() => {
    try {
      localStorage.setItem(STEP_KEY, String(currentStep));
    } catch (e) {
      console.error("Failed to save current step:", e);
    }
  }, [currentStep]);

  const updateData = useCallback(
    <K extends keyof VendorOnboardingData>(
      section: K,
      sectionData: VendorOnboardingData[K]
    ) => {
      setData((prev) => ({
        ...prev,
        [section]: sectionData,
      }));
    },
    []
  );

  const resetData = useCallback(() => {
    setData(initialOnboardingData);
    setCurrentStep(1);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_KEY);
  }, []);

  return {
    data,
    updateData,
    currentStep,
    setCurrentStep,
    lastSaved,
    resetData,
  };
}
