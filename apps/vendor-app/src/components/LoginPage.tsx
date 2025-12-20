"use client";

import React from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

const LoginPage: React.FC = () => {
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
              Login to Your Vendor Account
            </h1>
            <p className="text-gray-600 mt-2">
              Enter your phone number and email <br /> to access your dashboard
            </p>
          </div>

          <form onSubmit={() => {}} className="space-y-6">
            <div className="flex flex-col justify-center items-start gap-2">
              <Label>Owner Phone Number</Label>
              <Input maxLength={10} required />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 text-white cursor-pointer"
            >
              Sign in
            </Button>

            <div className="text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <Link href="/register" className="text-[#2C9C46] hover:underline">
                Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
