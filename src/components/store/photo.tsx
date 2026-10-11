import { useState } from "react";
import { cn } from "@/lib/cn";

export function Photo({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <span className={cn("relative block overflow-hidden bg-surface", className)}>
      {!loaded && !failed && <span className="media-skel absolute inset-0" aria-hidden />}
      {failed ? (
        <span className="absolute inset-0 flex items-end p-4 text-sm text-muted">{alt}</span>
      ) : (
        <img
          src={src}
          alt={alt}
          width={1200}
          height={1600}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "card-photo h-full w-full object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </span>
  );
}
