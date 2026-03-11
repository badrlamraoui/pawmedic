"use client";

import { cn } from "@/lib/utils";
import AnimalAvatar from "./AnimalAvatar";

interface Animal {
  id: string;
  name: string;
  species: "DOG" | "CAT";
  photoUrl?: string | null;
}

interface AnimalSwitcherProps {
  animals: Animal[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export default function AnimalSwitcher({
  animals,
  selectedId,
  onSelect,
  className,
}: AnimalSwitcherProps) {
  if (animals.length <= 1) return null;

  return (
    <div
      className={cn(
        "flex gap-3 overflow-x-auto pb-2 scrollbar-none",
        className
      )}
      style={{ scrollbarWidth: "none" }}
    >
      {animals.map((animal) => {
        const isSelected = animal.id === selectedId;
        return (
          <button
            key={animal.id}
            type="button"
            onClick={() => onSelect(animal.id)}
            className={cn(
              "flex flex-col items-center gap-1.5 shrink-0 transition-opacity",
              isSelected ? "opacity-100" : "opacity-50 hover:opacity-75"
            )}
          >
            <div
              className={cn(
                "rounded-2xl transition-all",
                isSelected ? "ring-2 ring-cyan ring-offset-2" : ""
              )}
            >
              <AnimalAvatar
                species={animal.species}
                photoUrl={animal.photoUrl}
                name={animal.name}
                size="md"
              />
            </div>
            <span
              className={cn(
                "text-xs font-mono max-w-[3rem] truncate",
                isSelected ? "text-cyan font-medium" : "text-muted"
              )}
            >
              {animal.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
