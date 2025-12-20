import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormField } from "../FormFeild";
import { PillSelector } from "../PillSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FoodBusinessData {
  fssaiNumber: string;
  kitchenState: string;
  is24x7Open: boolean;
  openingTime: string;
  closingTime: string;
}

export interface ClothingBusinessData {
  operationalState: "OPEN" | "CLOSED" | "MAINTENANCE" | "";
  returnPolicy: string;
}

interface StepBusinessDetailsProps {
  vendorType: "FOOD" | "CLOTHING";
  foodData: FoodBusinessData;
  clothingData: ClothingBusinessData;
  onFoodChange: (data: FoodBusinessData) => void;
  onClothingChange: (data: ClothingBusinessData) => void;
  errors: Partial<Record<string, string>>;
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
];

export function StepBusinessDetails({
  vendorType,
  foodData,
  clothingData,
  onFoodChange,
  onClothingChange,
  errors,
}: StepBusinessDetailsProps) {
  if (vendorType === "FOOD") {
    return (
      <div className="space-y-6 animate-slide-in-right">
        <FormField
          label="FSSAI License Number"
          htmlFor="fssai"
          required
          error={errors.fssaiNumber}
          helperText="14-digit Food Safety and Standards Authority of India license number"
        >
          <Input
            id="fssai"
            type="text"
            placeholder="e.g., 12345678901234"
            value={foodData.fssaiNumber}
            onChange={(e) =>
              onFoodChange({ ...foodData, fssaiNumber: e.target.value })
            }
            maxLength={14}
          />
        </FormField>

        <FormField
          label="Kitchen State"
          htmlFor="kitchenState"
          required
          error={errors.kitchenState}
        >
          <Select
            value={foodData.kitchenState}
            onValueChange={(value) =>
              onFoodChange({ ...foodData, kitchenState: value })
            }
          >
            <SelectTrigger id="kitchenState">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {INDIAN_STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <div className="flex items-center justify-between p-4 bg-accent rounded-xl">
          <div>
            <Label htmlFor="is24x7" className="font-medium">
              Open 24×7
            </Label>
            <p className="text-sm text-muted-foreground mt-0.5">
              Toggle if your kitchen operates round the clock
            </p>
          </div>
          <Switch
            id="is24x7"
            checked={foodData.is24x7Open}
            onCheckedChange={(checked) =>
              onFoodChange({ ...foodData, is24x7Open: checked })
            }
          />
        </div>

        {!foodData.is24x7Open && (
          <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
            <FormField
              label="Opening Time"
              htmlFor="openingTime"
              required
              error={errors.openingTime}
            >
              <Input
                id="openingTime"
                type="time"
                value={foodData.openingTime}
                onChange={(e) =>
                  onFoodChange({ ...foodData, openingTime: e.target.value })
                }
              />
            </FormField>

            <FormField
              label="Closing Time"
              htmlFor="closingTime"
              required
              error={errors.closingTime}
            >
              <Input
                id="closingTime"
                type="time"
                value={foodData.closingTime}
                onChange={(e) =>
                  onFoodChange({ ...foodData, closingTime: e.target.value })
                }
              />
            </FormField>
          </div>
        )}
      </div>
    );
  }

  // CLOTHING vendor
  return (
    <div className="space-y-6 animate-slide-in-right">
      <FormField
        label="Operational State"
        htmlFor="operationalState"
        required
        error={errors.operationalState}
      >
        <PillSelector
          options={[
            { value: "OPEN", label: "Open" },
            { value: "CLOSED", label: "Closed" },
            { value: "MAINTENANCE", label: "Maintenance" },
          ]}
          value={clothingData.operationalState}
          onChange={(value) =>
            onClothingChange({
              ...clothingData,
              operationalState: value as "OPEN" | "CLOSED" | "MAINTENANCE",
            })
          }
        />
      </FormField>

      <FormField
        label="Return Policy"
        htmlFor="returnPolicy"
        required
        error={errors.returnPolicy}
        helperText="Describe your return and exchange policy for customers"
      >
        <Textarea
          id="returnPolicy"
          placeholder="e.g., Products can be returned within 7 days of delivery. Items must be unworn with original tags attached..."
          value={clothingData.returnPolicy}
          onChange={(e) =>
            onClothingChange({ ...clothingData, returnPolicy: e.target.value })
          }
          rows={4}
        />
      </FormField>
    </div>
  );
}
