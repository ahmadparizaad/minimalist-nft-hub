
import { PriceRange } from "@/types";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface PriceFilterProps {
  initialRange: PriceRange;
  maxPrice: number;
  onChange: (range: PriceRange) => void;
}

export function PriceFilter({ initialRange, maxPrice, onChange }: PriceFilterProps) {
  const [range, setRange] = useState<PriceRange>(initialRange);

  // Handle slider change
  const handleSliderChange = (values: number[]) => {
    if (values.length === 2) {
      const newRange = { min: values[0], max: values[1] };
      setRange(newRange);
    }
  };

  // Handle min input change
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setRange(prev => ({ ...prev, min: Math.min(value, prev.max) }));
  };

  // Handle max input change
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setRange(prev => ({ ...prev, max: Math.max(value, prev.min) }));
  };

  // Notify parent of changes
  useEffect(() => {
    onChange(range);
  }, [range, onChange]);

  return (
    <div className="w-full space-y-4">
      <Slider
        defaultValue={[range.min, range.max]}
        min={0}
        max={maxPrice}
        step={1}
        value={[range.min, range.max]}
        onValueChange={handleSliderChange}
        className="py-5"
      />
      
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            type="number"
            min={0}
            max={range.max}
            value={range.min}
            onChange={handleMinChange}
            className="w-full"
            placeholder="Min"
          />
        </div>
        <div className="text-muted-foreground">to</div>
        <div className="flex-1">
          <Input
            type="number"
            min={range.min}
            max={maxPrice}
            value={range.max}
            onChange={handleMaxChange}
            className="w-full"
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );
}
