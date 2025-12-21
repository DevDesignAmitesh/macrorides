export interface OnboardingFormData {
  phone?: string;
  mobileOtpVerified: boolean;

  outlet: {
    name?: string;
    address?: string;
    country?: string;
    state?: string;
    city?: string;
    pincode?: string;
    contactNumber?: string;
  };

  owner: {
    name?: string;
    email?: string;
    phone?: string;
    emailOtpVerified: boolean;
  };
}
