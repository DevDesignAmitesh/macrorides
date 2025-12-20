"use client";

import React from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

const SignupPage: React.FC = () => {
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

          <form onSubmit={() => {}} className="space-y-6">
            <div className="flex flex-col justify-center items-start gap-2">
              <Label>Owner Name</Label>
              <Input required />
            </div>
            <div className="flex flex-col justify-center items-start gap-2">
              <Label>Owner Phone Number</Label>
              <Input maxLength={10} required />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 text-white cursor-pointer"
            >
              Sign up
            </Button>

            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/login" className="text-[#2C9C46] hover:underline">
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
