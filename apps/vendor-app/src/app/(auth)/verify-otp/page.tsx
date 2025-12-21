"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { useOnboarding } from "@/contexts/OnboardingContex"; 

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { update, setStep } = useOnboarding();

  const phone = typeof window !== "undefined"
    ? localStorage.getItem("signup_phone")
    : null;

  if (!phone) {
    router.replace("/signup");
    return null;
  }

  const verifyOtp = async () => {
    if (otp.length < 4) return alert("Enter valid OTP");

    try {
      setLoading(true);

      const res = await api.post("/auth/verify-otp", {
        phone,
        otp,
      });

      const token = res.data.data.token;
      localStorage.setItem("token", token);

      update({
        phone,
        mobileOtpVerified: true,
      });

      router.replace("/onboarding");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Verify OTP</h1>
      <p>OTP sent to {phone}</p>

      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />

      <button onClick={verifyOtp} disabled={loading}>
        {loading ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
}
