"use client";

import { useState, useMemo, useEffect } from "react";
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
import {
  useCreateBaseVendor,
  useCreateCategories,
  useCreateClosedDays,
  useCreateLocation,
  useCreateRoleBasedVendor,
  useSendEmail,
} from "@repo/hooks/hooks";
import { HTTP_URL, notify } from "@/utils";
import { StepEmailConfirmation } from "./steps/StepEmailConfirmation";
import { StepCommissionPlan } from "./steps/StepCommissionPlan";
import { toast } from "sonner";

const STEPS = [
  {
    id: 1,
    title: "Vendor Details",
    description: "Basic information",
  },
  {
    id: 2,
    title: "Business Details",
    description: "Operations info",
  },
  {
    id: 3,
    title: "Location",
    description: "Outlet address",
  },
  {
    id: 4,
    title: "Availability",
    description: "Weekly schedule",
  },
  {
    id: 5,
    title: "Categories",
    description: "Products or cuisines",
  },
  {
    id: 6,
    title: "Commission Plan",
    description: "Understand our platform charges",
  },
  {
    id: 7,
    title: "Email Confirmation",
    description: "Confirm your email for updates",
  },
  {
    id: 8,
    title: "Complete",
    description: "Finish onboarding",
  },
];

export function VendorOnboarding() {
  if (typeof window === "undefined") {
    return null;
  }

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
  const [vendorId, setVendorId] = useState<string>(
    localStorage.getItem("vendorId") ?? ""
  );

  const TOKEN = localStorage.getItem("token") ?? "";

  useEffect(() => {
    localStorage.setItem("vendorId", vendorId);
  }, [vendorId]);

  const vendorType = data.vendorBasics.vendorType;

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

  const { loading: l1, handleCreateBaseVendor } = useCreateBaseVendor({
    token: TOKEN,
    notify: notify,
    HTTP_URL: HTTP_URL,
  });

  const { loading: l2, handleCreateRoleBasedVendor } = useCreateRoleBasedVendor(
    {
      notify: notify,
      HTTP_URL: HTTP_URL,
      vendorId: vendorId,
      token: TOKEN,
    }
  );

  const { loading: l3, handleCreateLocation } = useCreateLocation({
    notify: notify,
    HTTP_URL: HTTP_URL,
    token: TOKEN,
    vendorId,
  });

  const { loading: l4, handleCreateClosedDays } = useCreateClosedDays({
    notify: notify,
    HTTP_URL: HTTP_URL,
    vendorId: vendorId,
    token: TOKEN,
  });

  const { loading: l5, handleCreateCategories } = useCreateCategories({
    notify: notify,
    HTTP_URL: HTTP_URL,
    vendorId: vendorId,
    token: TOKEN,
  });

  const { loading: l6, handleSendEmail } = useSendEmail({
    notify: notify,
    HTTP_URL: HTTP_URL,
    token: TOKEN,
  });

  const handleSuccess = () => {
    setErrors({});
    setSlideDirection("right");
    setCurrentStep(Math.min(currentStep + 1, 8));
  };

  const handleGoToDashboard = () => {
    toast.info("You can access dashboard after getting verified");
    return;
  };

  const handleNext = () => {
    if (isLoading) return;
    const validationErrors = validateStep(currentStep, data, vendorType);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (currentStep === 1) {
      handleCreateBaseVendor({
        handleSuccess: (vendorId) => {
          setVendorId(vendorId);
          handleSuccess();
        },
        input: {
          ...data.vendorBasics,
          type: data.vendorBasics.vendorType,
        },
      });
      return;
    } else if (currentStep === 2) {
      if (data.vendorBasics.vendorType === "CLOTHING") {
        handleCreateRoleBasedVendor({
          handleSuccess,
          main: {
            type: data.vendorBasics.vendorType,
            input: {
              ...data.clothingBusiness,
              vendorId: vendorId,
            },
          },
        });
      } else if (data.vendorBasics.vendorType === "FOOD") {
        handleCreateRoleBasedVendor({
          handleSuccess,
          main: {
            type: data.vendorBasics.vendorType,
            input: {
              ...data.foodBusiness,
              vendorId: vendorId,
            },
          },
        });
      }
      return;
    } else if (currentStep === 3) {
      handleCreateLocation({
        handleSuccess,
        input: [{ ...data.location, vendorId }],
      });
      return;
    } else if (currentStep === 4) {
      handleCreateClosedDays({
        handleSuccess,
        input: { ...data.closedDays, vendorId: vendorId },
      });
      return;
    } else if (currentStep === 5) {
      handleCreateCategories({
        handleSuccess,
        input: {
          name: data.categories.categories,
          vendorId: vendorId,
          type: data.vendorBasics.vendorType,
        },
      });
      return;
    } else if (currentStep === 6) {
      handleSuccess();
      return;
    } else if (currentStep === 7) {
      handleSendEmail({
        handleSuccess,
        input: {
          email: data.email,
          type: "VENDOR_ONBOARDING_CONFIRMATION",
        },
      });
      return;
    } else if (currentStep === 8) {
      handleGoToDashboard();
    }
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

  const isComplete = currentStep === 8;

  const isLoading = l1 || l2 || l3 || l4 || l5 || l6;

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
                  <StepCommissionPlan
                    vendorType={data.vendorBasics.vendorType}
                  />
                )}

                {currentStep === 7 && (
                  <StepEmailConfirmation
                    email={data.email}
                    onEmailChange={(email) => updateData("email", email)}
                  />
                )}

                {currentStep === 8 && (
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
                        disabled={isLoading}
                        variant="ghost"
                        onClick={handleBack}
                        className="gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </Button>
                    )}
                  </div>
                  <Button
                    disabled={isLoading}
                    onClick={handleNext}
                    className="gap-2"
                  >
                    {isLoading
                      ? "Processing..."
                      : currentStep === 7
                        ? "Confirm & Finish"
                        : "Next"}
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
