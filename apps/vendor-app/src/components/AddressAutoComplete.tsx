"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { HTTP_URL } from "@/utils";

export interface SendMapDataToUser {
  title: string;
  shortDesc: string;
  longDesc: string;
  lat: number;
  lng: number;
}

interface AddressAutocompleteProps {
  id?: string;
  value: string;
  placeholder?: string;
  error?: string;
  onSelect: (data: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
  onChange: (value: string) => void;
}

export const AddressAutocomplete = ({
  id = "address",
  value,
  placeholder,
  error,
  onSelect,
  onChange,
}: AddressAutocompleteProps) => {
  const [mapsData, setMapsData] = useState<SendMapDataToUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleChange = (val: string) => {
    onChange(val);
    setMapsData([]);

    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(async () => {
      if (!val) return;

      setLoading(true);
      try {
        const res = await fetch(`${HTTP_URL}/maps/suggestions/${val}`);
        if (res.ok) {
          const data = await res.json();
          setMapsData(data.suggestions || []);
        }
      } catch {
        setMapsData([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    setDebounceTimer(timer);
  };

  const handleSelect = (item: SendMapDataToUser) => {
    onSelect({
      address: item.longDesc || item.title,
      latitude: item.lat,
      longitude: item.lng,
    });
    setMapsData([]);
  };

  return (
    <div className="relative">
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e.target.value)}
        className={error ? "border-destructive" : ""}
      />

      {loading && (
        <div className="absolute right-3 top-2.5 text-xs text-muted-foreground">
          Loading…
        </div>
      )}

      {mapsData.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full rounded-md border bg-background shadow-md max-h-56 overflow-y-auto">
          {mapsData.map((item, index) => (
            <li
              key={index}
              className="cursor-pointer px-3 py-2 hover:bg-muted text-sm"
              onClick={() => handleSelect(item)}
            >
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-muted-foreground">
                {item.shortDesc}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
