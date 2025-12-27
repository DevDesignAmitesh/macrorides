import { Input } from "@/components/ui/input";
import { FormField } from "../FormFeild";
import { RadioCard } from "../RadioCard";
import { UtensilsCrossed, Shirt } from "lucide-react";
import { vendorType } from "@repo/types/types";

export interface VendorBasicsData {
  aadhaarNumber: string;
  panNumber: string;
  contactNumber: string;
  outletName: string;
  vendorType: "FOOD" | "CLOTHING" | "";
}

interface StepVendorBasicsProps {
  data: VendorBasicsData;
  onChange: (data: VendorBasicsData) => void;
  errors: Partial<Record<keyof VendorBasicsData, string>>;
}

export function StepVendorBasics({
  data,
  onChange,
  errors,
}: StepVendorBasicsProps) {
  const updateField = <K extends keyof VendorBasicsData>(
    field: K,
    value: VendorBasicsData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-slide-in-right">
      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          label="Owner Aadhaar Number"
          htmlFor="aadhaar"
          required
          error={errors.aadhaarNumber}
          helperText="12-digit unique identification number"
        >
          <Input
            id="aadhaar"
            type="text"
            placeholder="e.g., 1234 5678 9012"
            value={data.aadhaarNumber}
            onChange={(e) => updateField("aadhaarNumber", e.target.value)}
            maxLength={14}
          />
        </FormField>

        <FormField
          label="Owner PAN Number"
          htmlFor="pan"
          required
          error={errors.panNumber}
          helperText="e.g., ABCDE1234F"
        >
          <Input
            id="pan"
            type="text"
            placeholder="e.g., ABCDE1234F"
            value={data.panNumber}
            onChange={(e) =>
              updateField("panNumber", e.target.value.toUpperCase())
            }
            maxLength={10}
          />
        </FormField>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          label="Outlet Contact Number (10 digits)"
          htmlFor="contact"
          required
          error={errors.contactNumber}
        >
          <Input
            id="contact"
            type="tel"
            placeholder="e.g., +91 99999 99999"
            value={data.contactNumber}
            onChange={(e) => updateField("contactNumber", e.target.value)}
          />
        </FormField>

        <FormField
          label="Outlet Name"
          htmlFor="outlet"
          required
          error={errors.outletName}
        >
          <Input
            id="outlet"
            type="text"
            placeholder="e.g., Spice Garden Restaurant"
            value={data.outletName}
            onChange={(e) => updateField("outletName", e.target.value)}
          />
        </FormField>
      </div>

      <FormField
        label="Vendor Type"
        htmlFor="vendorType"
        required
        error={errors.vendorType}
      >
        <RadioCard
          options={[
            {
              value: "FOOD",
              label: "Food Vendor",
              description:
                "Restaurants, cloud kitchens, bakeries, and food outlets",
              icon: <UtensilsCrossed className="w-6 h-6" />,
            },
            {
              value: "CLOTHING",
              label: "Clothing Vendor",
              description: "Fashion stores, boutiques, and apparel outlets",
              icon: <Shirt className="w-6 h-6" />,
            },
          ]}
          value={data.vendorType}
          onChange={(value) =>
            updateField("vendorType", value as vendorType)
          }
          className="md:grid-cols-2"
        />
      </FormField>
    </div>
  );
}
