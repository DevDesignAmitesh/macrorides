import { VendorOnboardingData, VendorType } from "./types";

export type ValidationErrors = Partial<Record<string, string>>;

export function validateStep(
  step: number,
  data: VendorOnboardingData,
  vendorType: VendorType
): ValidationErrors {
  const errors: ValidationErrors = {};

  switch (step) {
    case 1: {
      const { vendorBasics } = data;
      if (!vendorBasics.aadhaarNumber.trim()) {
        errors.aadhaarNumber = "Aadhaar number is required";
      } else if (vendorBasics.aadhaarNumber.replace(/\s/g, "").length !== 12) {
        errors.aadhaarNumber = "Aadhaar number must be 12 digits";
      }

      if (!vendorBasics.panNumber.trim()) {
        errors.panNumber = "PAN number is required";
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(vendorBasics.panNumber)) {
        errors.panNumber = "Invalid PAN format (e.g., ABCDE1234F)";
      }

      if (!vendorBasics.contactNumber.trim()) {
        errors.contactNumber = "Contact number is required";
      }

      if (!vendorBasics.outletName.trim()) {
        errors.outletName = "Outlet name is required";
      }

      if (!vendorBasics.vendorType) {
        errors.vendorType = "Please select a vendor type";
      }
      break;
    }

    case 2: {
      if (vendorType === "FOOD") {
        const { foodBusiness } = data;
        if (!foodBusiness.fssaiNumber.trim()) {
          errors.fssaiNumber = "FSSAI number is required";
        } else if (foodBusiness.fssaiNumber.length !== 14) {
          errors.fssaiNumber = "FSSAI number must be 14 digits";
        }

        if (!foodBusiness.kitchenState) {
          errors.kitchenState = "Kitchen state is required";
        }

        if (!foodBusiness.is24x7Open) {
          if (!foodBusiness.openingTime) {
            errors.openingTime = "Opening time is required";
          }
          if (!foodBusiness.closingTime) {
            errors.closingTime = "Closing time is required";
          }
        }
      } else if (vendorType === "CLOTHING") {
        const { clothingBusiness } = data;
        if (!clothingBusiness.operationalState) {
          errors.operationalState = "Operational state is required";
        }
        if (!clothingBusiness.returnPolicy.trim()) {
          errors.returnPolicy = "Return policy is required";
        }
      }
      break;
    }

    case 3: {
      const { location } = data;
      if (!location.address.trim()) {
        errors.address = "Address is required";
      }
      if (!location.locationLabel) {
        errors.locationLabel = "Location label is required";
      }
      break;
    }

    case 4: {
      // Closed days is optional, no validation needed
      break;
    }

    case 5: {
      const { categories } = data;
      if (categories.categories.length === 0) {
        errors.categories = "Please select at least one category";
      }
      break;
    }
  }

  return errors;
}
