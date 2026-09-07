interface ImageProps {
  className: string;
  src?: string;
  alt: string;
  fallbackImageUrl?: string;
}

export default function Image({
  className,
  src,
  alt,
  fallbackImageUrl,
}: ImageProps) {
  const placeholderUrl = fallbackImageUrl || "/placeholder.svg";
  return (
    <>
      <img
        className={className}
        src={src || placeholderUrl}
        alt={alt}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = placeholderUrl;
        }}
      />
    </>
  );
}
