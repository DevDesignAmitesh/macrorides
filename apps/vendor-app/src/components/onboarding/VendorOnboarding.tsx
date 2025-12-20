"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { MobileProgressBar } from "./MobileProgressBar";
import { StepVendorBasics } from "./steps/StepVendorBasics";
import { StepBusinessDetails } from "./steps/StepBusinessDetails";
import { StepLocation } from "./steps/StepLocation";
import { StepClosedDays } from "./steps/StepClosedDays";
import { StepCategories } from "./steps/StepCategories";
import { StepSuccess } from "./steps/StepSuccess";
import { useOnboardingStorage } from "./useOnboardingStorage";
import { validateStep, ValidationErrors } from "./validation";
import { vendorType } from "@repo/db/db";

const STEPS = [
  {
    id: 1,
    title: "Vendor Details",
    description: "Basic information to identify your business",
  },
  {
    id: 2,
    title: "Business Details",
    description: "Operations and compliance information",
  },
  { id: 3, title: "Location", description: "Outlet address and coordinates" },
  {
    id: 4,
    title: "Availability",
    description: "Weekly schedule and closed days",
  },
  { id: 5, title: "Categories", description: "Product or cuisine categories" },
  { id: 6, title: "Complete", description: "Review and submit" },
];

export function VendorOnboarding() {
  const {
    data,
    updateData,
    currentStep,
    setCurrentStep,
    lastSaved,
    resetData,
  } = useOnboardingStorage();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );

  const vendorType = data.vendorBasics.vendorType as vendorType;

  const currentStepInfo = useMemo(() => {
    const step = STEPS.find((s) => s.id === currentStep);
    if (currentStep === 2 && vendorType) {
      return {
        ...step!,
        title:
          vendorType === "FOOD" ? "Kitchen Information" : "Store Operations",
        description:
          vendorType === "FOOD"
            ? "FSSAI details and operating hours"
            : "Operational status and policies",
      };
    }
    return step!;
  }, [currentStep, vendorType]);

  const handleNext = () => {
    const validationErrors = validateStep(currentStep, data, vendorType);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSlideDirection("right");
    setCurrentStep(Math.min(currentStep + 1, 6));
  };

  const handleBack = () => {
    setErrors({});
    setSlideDirection("left");
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setSlideDirection("left");
      setCurrentStep(step);
      setErrors({});
    }
  };

  const handleGoToDashboard = () => {
    resetData();
    // In real app, would navigate to dashboard
  };

  const isComplete = currentStep === 6;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Vendor Onboarding
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete the following steps to register your outlet
          </p>
        </div>

        {/* Mobile Progress Bar */}
        <div className="lg:hidden mb-6">
          <MobileProgressBar
            currentStep={currentStep}
            totalSteps={6}
            stepTitle={currentStepInfo.title}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Step Indicator (Desktop) */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-8 shadow-wizard-card">
              <StepIndicator
                steps={STEPS}
                currentStep={currentStep}
                onStepClick={handleStepClick}
              />

              {/* Auto-save indicator */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Save className="w-3.5 h-3.5" />
                  {lastSaved ? (
                    <span>
                      Saved at{" "}
                      {lastSaved.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  ) : (
                    <span>Your progress is saved automatically</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-card rounded-2xl border border-border shadow-wizard-card overflow-hidden">
              {/* Step Header */}
              {!isComplete && (
                <div className="px-6 py-5 border-b border-border bg-accent/30">
                  <h2 className="text-xl font-semibold text-foreground">
                    {currentStepInfo.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {currentStepInfo.description}
                  </p>
                </div>
              )}

              {/* Step Content */}
              <div className="p-6" key={currentStep}>
                {currentStep === 1 && (
                  <StepVendorBasics
                    data={data.vendorBasics}
                    onChange={(d) => updateData("vendorBasics", d)}
                    errors={errors}
                  />
                )}

                {currentStep === 2 && vendorType && (
                  <StepBusinessDetails
                    vendorType={vendorType}
                    foodData={data.foodBusiness}
                    clothingData={data.clothingBusiness}
                    onFoodChange={(d) => updateData("foodBusiness", d)}
                    onClothingChange={(d) => updateData("clothingBusiness", d)}
                    errors={errors}
                  />
                )}

                {currentStep === 3 && (
                  <StepLocation
                    data={data.location}
                    onChange={(d) => updateData("location", d)}
                    errors={errors}
                  />
                )}

                {currentStep === 4 && (
                  <StepClosedDays
                    data={data.closedDays}
                    onChange={(d) => updateData("closedDays", d)}
                    errors={errors}
                  />
                )}

                {currentStep === 5 && vendorType && (
                  <StepCategories
                    vendorType={vendorType}
                    data={data.categories}
                    onChange={(d) => updateData("categories", d)}
                    errors={errors}
                  />
                )}

                {currentStep === 6 && (
                  <StepSuccess
                    outletName={data.vendorBasics.outletName || "Your Outlet"}
                    onGoToDashboard={handleGoToDashboard}
                  />
                )}
              </div>

              {/* Navigation Footer */}
              {!isComplete && (
                <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-between items-center">
                  <div>
                    {currentStep > 1 && (
                      <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </Button>
                    )}
                  </div>
                  <Button onClick={handleNext} className="gap-2">
                    {currentStep === 5 ? "Complete" : "Next"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Auto-save indicator */}
            <div className="lg:hidden mt-4 flex justify-center">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Save className="w-3.5 h-3.5" />
                <span>Your progress is saved automatically</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
