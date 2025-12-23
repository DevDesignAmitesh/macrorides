import VerifyOTPPage from "@/components/VerifyOTP";
import { Suspense } from "react";

export default function verifyOtp() {
  return (
    <Suspense fallback="Loading....">
      <VerifyOTPPage />
    </Suspense>
  );
}
