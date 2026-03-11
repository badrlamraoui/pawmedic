import { cn } from "@/lib/utils";

interface AnimalAvatarProps {
  species: "DOG" | "CAT";
  photoUrl?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

const iconSizes = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

function DogIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="32" cy="36" rx="18" ry="14" fill="currentColor" opacity="0.15" />
      <circle cx="32" cy="26" r="12" fill="currentColor" opacity="0.25" />
      <ellipse cx="20" cy="20" rx="5" ry="8" fill="currentColor" opacity="0.3" transform="rotate(-20 20 20)" />
      <ellipse cx="44" cy="20" rx="5" ry="8" fill="currentColor" opacity="0.3" transform="rotate(20 44 20)" />
      <circle cx="26" cy="28" r="2" fill="currentColor" />
      <circle cx="38" cy="28" r="2" fill="currentColor" />
      <ellipse cx="32" cy="33" rx="3" ry="2" fill="currentColor" opacity="0.4" />
      <path d="M28 38 Q32 41 36 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CatIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="14" fill="currentColor" opacity="0.2" />
      <path d="M20 24 L18 14 L26 20" fill="currentColor" opacity="0.3" />
      <path d="M44 24 L46 14 L38 20" fill="currentColor" opacity="0.3" />
      <circle cx="26" cy="32" r="2" fill="currentColor" />
      <circle cx="38" cy="32" r="2" fill="currentColor" />
      <ellipse cx="32" cy="36" rx="2" ry="1.5" fill="currentColor" opacity="0.5" />
      <path d="M24 40 Q32 44 40 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 34 L28 36M42 34 L36 36" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export default function AnimalAvatar({
  species,
  photoUrl,
  name,
  size = "md",
  className,
}: AnimalAvatarProps) {
  if (photoUrl) {
    return (
      <div className={cn("rounded-2xl overflow-hidden bg-cyan-light", sizeClasses[size], className)}>
        <img
          src={photoUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl bg-cyan-light text-cyan flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      {species === "DOG" ? (
        <DogIcon size={iconSizes[size]} />
      ) : (
        <CatIcon size={iconSizes[size]} />
      )}
    </div>
  );
}
