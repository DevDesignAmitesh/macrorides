import { kitchenState, locationLabel, operationalState, vendorType } from "@repo/types/types";

export interface VendorOnboardingData {
  // Step 1
  vendorBasics: {
    aadhaarNumber: string;
    panNumber: string;
    contactNumber: string;
    outletName: string;
    vendorType: vendorType | "";
  };
  // Step 2 - Food
  foodBusiness: {
    fssaiNumber: string;
    kitchenState: kitchenState;
    is247: boolean;
    openingTime: string | undefined;
    closingTime: string | undefined;
  };
  // Step 2 - Clothing
  clothingBusiness: {
    operationalState: operationalState;
    returnPolicy: string;
  };
  // Step 3
  location: {
    address: string;
    latitude: number;
    longitude: number;
    label: locationLabel;
  };
  // Step 4
  closedDays: {
    closedDays: string[];
  };
  // Step 5
  categories: {
    categories: string[];
  };
  // step 6
  email: string
}

export const initialOnboardingData: VendorOnboardingData = {
  vendorBasics: {
    aadhaarNumber: "",
    panNumber: "",
    contactNumber: "",
    outletName: "",
    vendorType: "",
  },
  foodBusiness: {
    fssaiNumber: "",
    kitchenState: "OPEN",
    is247: false,
    openingTime: undefined,
    closingTime: undefined,
  },
  clothingBusiness: {
    operationalState: "OPEN",
    returnPolicy: "",
  },
  location: {
    address: "",
    latitude: 0,
    longitude: 0,
    label: "OUTLET",
  },
  closedDays: {
    closedDays: [],
  },
  categories: {
    categories: [],
  },
  email: ""
};
