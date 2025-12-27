"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useCreateAccount } from "@repo/hooks/hooks";
import { AccountSignupInput } from "@repo/types/types";
import { useRouter } from "next/navigation";
import { HTTP_URL, notify } from "@/utils";

const SignupPage: React.FC = () => {
  const [formData, setFromData] = useState<AccountSignupInput>({
    name: "",
    phone: "",
    role: "VENDOR_OWNER",
  });

  const router = useRouter();

  const handleChange = (index: keyof AccountSignupInput, value: string) => {
    setFromData((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleSuccess = () => {
    router.push(`/verify-otp?phone=${formData.phone}`);
  };

  const { handleCreateAccount, loading } = useCreateAccount({ notify, HTTP_URL: HTTP_URL });
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-full flex justify-center items-center mb-4">
              <Logo />
            </div>
            <h1 className="text-2xl font-bold text-black">
              Create Your Vendor Account
            </h1>
            <p className="text-gray-600 mt-2">
              Enter your name and phone number <br /> to get started
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateAccount({ handleSuccess, input: formData });
            }}
            className="space-y-6"
          >
            <div className="flex flex-col justify-center items-start gap-2">
              <Label>Owner Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col justify-center items-start gap-2">
              <Label>Owner Phone Number (10 digits)</Label>
              <Input
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                maxLength={10}
                required
              />
            </div>

            <Button
              disabled={loading}
              type="submit"
              className="w-full bg-green-600 text-white cursor-pointer"
            >
              {loading ? "Processing..." : "Sign up"}
            </Button>

            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                href={loading ? "" : "/login"}
                className="text-[#2C9C46] hover:underline"
              >
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
