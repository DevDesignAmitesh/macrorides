"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { AccountOTPVerifyInput } from "@repo/types/types";
import { useOTPVerifyAccount, useLoginAccount } from "@repo/hooks/hooks";
import { notify } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";

const RESEND_TIMER = 50;

const VerifyOTPPage: React.FC = () => {
  const params = useSearchParams();
  const phone = params.get("phone");
  const router = useRouter();

  if (!phone) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <h2 className="text-xl font-semibold text-black">
          Invalid or expired OTP session
        </h2>
        <Link
          href="/login"
          className="text-[#2C9C46] font-medium hover:underline"
        >
          Go back to login
        </Link>
      </div>
    );
  }

  const [formData, setFormData] = useState<AccountOTPVerifyInput>({
    phone,
    otp: "",
  });

  const [timer, setTimer] = useState<number>(RESEND_TIMER);

  const { loading: loadingVerify, handleOTPVerifyAccount } =
    useOTPVerifyAccount({ notify });

  const { loading: loadingResend, handleLoginAccount } = useLoginAccount({
    notify,
  });

  const isLoading = loadingVerify || loadingResend;

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (key: keyof AccountOTPVerifyInput, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleVerifySuccess = (token: string) => {
    localStorage.setItem("token", token);
    router.push("/onboarding");
  };

  const handleResendSuccess = () => {
    setTimer(RESEND_TIMER);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-full flex justify-center items-center mb-4">
              <Logo />
            </div>
            <h1 className="text-2xl font-bold text-black">Verify OTP</h1>
            <p className="text-gray-600 mt-2">
              Enter the 6-digit OTP sent to <br /> your registered phone number
              {" "} <span className="font-semibold">{phone}</span>
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleOTPVerifyAccount({
                input: formData,
                handleSuccess: handleVerifySuccess,
              });
            }}
            className="space-y-6"
          >
            <div className="flex flex-col gap-2">
              <Label>One Time Password (OTP)</Label>
              <Input
                value={formData.otp}
                onChange={(e) => handleChange("otp", e.target.value)}
                maxLength={6}
                placeholder="Enter OTP"
                required
              />
            </div>

            <Button
              disabled={isLoading}
              type="submit"
              className="w-full bg-green-600 text-white cursor-pointer"
            >
              {loadingVerify ? "Verifying..." : "Verify & Continue"}
            </Button>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Didn’t receive the OTP?</span>

              {timer > 0 ? (
                <span className="text-gray-400">Resend in {timer}s</span>
              ) : (
                <button
                  type="button"
                  disabled={loadingResend}
                  onClick={() =>
                    handleLoginAccount({
                      input: { phone },
                      handleSuccess: handleResendSuccess,
                    })
                  }
                  className="text-[#2C9C46] hover:underline"
                >
                  {loadingResend ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </div>

            <div className="text-center">
              <Link href="/login" className="text-gray-500 hover:underline">
                Change phone number
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
