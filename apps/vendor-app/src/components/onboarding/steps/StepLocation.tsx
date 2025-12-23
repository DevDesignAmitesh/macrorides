import { Input } from "@/components/ui/input";
import { FormField } from "../FormFeild";
import { PillSelector } from "../PillSelector";
import { locationLabel } from "@repo/types/types";
import { AddressAutocomplete } from "@/components/AddressAutoComplete";

export interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
  label: locationLabel;
}

interface StepLocationProps {
  data: LocationData;
  onChange: (data: LocationData) => void;
  errors: Partial<Record<keyof LocationData, string>>;
}

export function StepLocation({ data, onChange, errors }: StepLocationProps) {
  const updateField = <K extends keyof LocationData>(
    field: K,
    value: LocationData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-slide-in-right">
      {/* Address */}
      <FormField
        label="Address"
        htmlFor="address"
        required
        error={errors.address}
        helperText="Location will be auto-detected from address"
      >
        <AddressAutocomplete
          value={data.address}
          placeholder="e.g., 123, MG Road, Indiranagar, Bangalore - 560038"
          error={errors.address}
          onChange={(val) => updateField("address", val)}
          onSelect={({ address, latitude, longitude }) =>
            onChange({
              ...data,
              address,
              latitude,
              longitude,
            })
          }
        />
      </FormField>

      {/* Lat / Lng */}
      <div className="grid md:grid-cols-2 gap-4">
        <FormField label="Latitude" htmlFor="latitude">
          <Input
            id="latitude"
            value={data.latitude || ""}
            placeholder="Auto-detected"
            disabled
            className="bg-muted text-muted-foreground"
          />
        </FormField>

        <FormField label="Longitude" htmlFor="longitude">
          <Input
            id="longitude"
            value={data.longitude || ""}
            placeholder="Auto-detected"
            disabled
            className="bg-muted text-muted-foreground"
          />
        </FormField>
      </div>
    </div>
  );
}
