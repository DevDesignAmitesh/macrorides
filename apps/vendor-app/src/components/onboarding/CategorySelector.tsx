import { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CategorySelectorProps {
  categories: string[];
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  onAddCustom: (category: string) => void;
  className?: string;
}

export function CategorySelector({
  categories,
  selectedCategories,
  onChange,
  onAddCustom,
  className,
}: CategorySelectorProps) {
  const [customCategory, setCustomCategory] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleToggle = (category: string) => {
    const newSelected = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    onChange(newSelected);
  };

  const handleAddCustom = () => {
    if (customCategory.trim() && !categories.includes(customCategory.trim())) {
      onAddCustom(customCategory.trim());
      onChange([...selectedCategories, customCategory.trim()]);
      setCustomCategory("");
      setShowInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustom();
    }
    if (e.key === "Escape") {
      setShowInput(false);
      setCustomCategory("");
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              type="button"
              onClick={() => handleToggle(category)}
              className={cn(
                "pill-selector",
                isSelected ? "pill-selector-active" : "pill-selector-inactive"
              )}
            >
              {category}
              {isSelected && <X className="w-3.5 h-3.5 ml-1.5" />}
            </button>
          );
        })}
      </div>

      {showInput ? (
        <div className="flex gap-2 items-center">
          <Input
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter category name..."
            className="max-w-xs"
            autoFocus
          />
          <Button
            size="sm"
            onClick={handleAddCustom}
            disabled={!customCategory.trim()}
          >
            Add
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setShowInput(false);
              setCustomCategory("");
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowInput(true)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add custom category
        </button>
      )}

      <p className="text-xs text-muted-foreground">
        You can add your own categories
      </p>
    </div>
  );
}
