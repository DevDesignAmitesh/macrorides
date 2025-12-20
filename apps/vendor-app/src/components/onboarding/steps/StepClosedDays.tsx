import { FormField } from "../FormFeild";
import { PillSelector } from "../PillSelector";

export interface ClosedDaysData {
  closedDays: string[];
}

interface StepClosedDaysProps {
  data: ClosedDaysData;
  onChange: (data: ClosedDaysData) => void;
  errors: Partial<Record<keyof ClosedDaysData, string>>;
}

const DAYS_OF_WEEK = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];

export function StepClosedDays({
  data,
  onChange,
  errors,
}: StepClosedDaysProps) {
  return (
    <div className="space-y-6 animate-slide-in-right">
      <FormField
        label="Closed Days"
        htmlFor="closedDays"
        helperText="Select the days your outlet remains closed. Leave empty if open all days."
        error={errors.closedDays}
      >
        <PillSelector
          options={DAYS_OF_WEEK}
          value={data.closedDays}
          onChange={(value) => onChange({ closedDays: value as string[] })}
          multiple
        />
      </FormField>

      <div className="p-4 bg-accent rounded-xl">
        <p className="text-sm text-accent-foreground">
          {data.closedDays.length === 0 ? (
            <>
              Your outlet will be shown as <strong>open all days</strong> of the
              week.
            </>
          ) : data.closedDays.length === 7 ? (
            <>
              Your outlet will be shown as <strong>permanently closed</strong>.
            </>
          ) : (
            <>
              Your outlet will be{" "}
              <strong>
                closed on {data.closedDays.length} day
                {data.closedDays.length > 1 ? "s" : ""}
              </strong>{" "}
              per week.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
