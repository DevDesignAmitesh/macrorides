import { useState } from "react";
import { FormField } from "../FormFeild";
import { CategorySelector } from "../CategorySelector";

export interface CategoriesData {
  categories: string[];
}

interface StepCategoriesProps {
  vendorType: "FOOD" | "CLOTHING";
  data: CategoriesData;
  onChange: (data: CategoriesData) => void;
  errors: Partial<Record<keyof CategoriesData, string>>;
}

const FOOD_CATEGORIES = [
  "Indian",
  "Chinese",
  "Italian",
  "Mexican",
  "South Indian",
  "Bakery",
];

const CLOTHING_CATEGORIES = [
  "Men",
  "Women",
  "Kids",
  "Unisex",
  "Streetwear",
  "Ethnic",
];

export function StepCategories({
  vendorType,
  data,
  onChange,
  errors,
}: StepCategoriesProps) {
  const initialCategories =
    vendorType === "FOOD" ? FOOD_CATEGORIES : CLOTHING_CATEGORIES;
  const [allCategories, setAllCategories] = useState(initialCategories);

  const handleAddCustom = (category: string) => {
    setAllCategories([...allCategories, category]);
  };

  return (
    <div className="space-y-6 animate-slide-in-right">
      <FormField
        label={
          vendorType === "FOOD" ? "Cuisine Categories" : "Product Categories"
        }
        htmlFor="categories"
        required
        error={errors.categories}
      >
        <CategorySelector
          categories={allCategories}
          selectedCategories={data.categories}
          onChange={(categories) => onChange({ categories })}
          onAddCustom={handleAddCustom}
        />
      </FormField>

      {data.categories.length > 0 && (
        <div className="p-4 bg-accent rounded-xl animate-fade-in">
          <p className="text-sm text-accent-foreground">
            You've selected{" "}
            <strong>
              {data.categories.length}{" "}
              {data.categories.length > 1 ? "categories" : "category"}
            </strong>
            : {data.categories.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
