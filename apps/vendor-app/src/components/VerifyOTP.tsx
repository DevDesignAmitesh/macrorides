"use client";

import React from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

const VerifyOTPPage: React.FC = () => {
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
            </p>
          </div>

          <form onSubmit={() => {}} className="space-y-6">
            <div className="flex flex-col justify-center items-start gap-2">
              <Label>One Time Password (OTP)</Label>
              <Input maxLength={6} placeholder="Enter OTP" required />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 text-white cursor-pointer"
            >
              Verify & Continue
            </Button>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Didn’t receive the OTP?</span>
              <button type="button" className="text-[#2C9C46] hover:underline">
                Resend OTP
              </button>
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
