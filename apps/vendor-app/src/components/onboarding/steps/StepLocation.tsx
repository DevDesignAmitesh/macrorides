import { Input } from "@/components/ui/input";
import { FormField } from "../FormFeild";
import { PillSelector } from "../PillSelector";

export interface LocationData {
  address: string;
  latitude: string;
  longitude: string;
  locationLabel: string;
}

interface StepLocationProps {
  data: LocationData;
  onChange: (data: LocationData) => void;
  errors: Partial<Record<keyof LocationData, string>>;
}

const LOCATION_LABELS = [
  { value: "HOME", label: "Home" },
  { value: "WORK", label: "Work" },
  { value: "OUTLET", label: "Outlet" },
  { value: "PICKUP", label: "Pickup" },
  { value: "DROP", label: "Drop" },
];

export function StepLocation({ data, onChange, errors }: StepLocationProps) {
  const updateField = <K extends keyof LocationData>(
    field: K,
    value: LocationData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  // Simulate auto-detection of lat/long when address changes
  const handleAddressChange = (address: string) => {
    updateField("address", address);
    // Simulated coordinates
    if (address.length > 10) {
      onChange({
        ...data,
        address,
        latitude: "12.9716",
        longitude: "77.5946",
      });
    }
  };

  return (
    <div className="space-y-6 animate-slide-in-right">
      <FormField
        label="Address"
        htmlFor="address"
        required
        error={errors.address}
        helperText="Location will be auto-detected from address"
      >
        <Input
          id="address"
          type="text"
          placeholder="e.g., 123, MG Road, Indiranagar, Bangalore - 560038"
          value={data.address}
          onChange={(e) => handleAddressChange(e.target.value)}
        />
      </FormField>

      <div className="grid md:grid-cols-2 gap-4">
        <FormField label="Latitude" htmlFor="latitude">
          <Input
            id="latitude"
            type="text"
            value={data.latitude}
            placeholder="Auto-detected"
            disabled
            className="bg-muted text-muted-foreground"
          />
        </FormField>

        <FormField label="Longitude" htmlFor="longitude">
          <Input
            id="longitude"
            type="text"
            value={data.longitude}
            placeholder="Auto-detected"
            disabled
            className="bg-muted text-muted-foreground"
          />
        </FormField>
      </div>

      <FormField
        label="Location Label"
        htmlFor="locationLabel"
        required
        error={errors.locationLabel}
      >
        <PillSelector
          options={LOCATION_LABELS}
          value={data.locationLabel}
          onChange={(value) => updateField("locationLabel", value as string)}
        />
      </FormField>
    </div>
  );
}
