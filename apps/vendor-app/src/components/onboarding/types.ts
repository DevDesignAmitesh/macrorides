export type VendorType = "FOOD" | "CLOTHING" | "";

export interface VendorOnboardingData {
  // Step 1
  vendorBasics: {
    aadhaarNumber: string;
    panNumber: string;
    contactNumber: string;
    outletName: string;
    vendorType: VendorType;
  };
  // Step 2 - Food
  foodBusiness: {
    fssaiNumber: string;
    kitchenState: string;
    is24x7Open: boolean;
    openingTime: string;
    closingTime: string;
  };
  // Step 2 - Clothing
  clothingBusiness: {
    operationalState: "OPEN" | "CLOSED" | "MAINTENANCE" | "";
    returnPolicy: string;
  };
  // Step 3
  location: {
    address: string;
    latitude: string;
    longitude: string;
    locationLabel: string;
  };
  // Step 4
  closedDays: {
    closedDays: string[];
  };
  // Step 5
  categories: {
    categories: string[];
  };
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
    kitchenState: "",
    is24x7Open: false,
    openingTime: "",
    closingTime: "",
  },
  clothingBusiness: {
    operationalState: "",
    returnPolicy: "",
  },
  location: {
    address: "",
    latitude: "",
    longitude: "",
    locationLabel: "OUTLET",
  },
  closedDays: {
    closedDays: [],
  },
  categories: {
    categories: [],
  },
};
