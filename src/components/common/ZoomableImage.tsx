import { memo } from 'react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ZoomableImage = memo(function ZoomableImage({ src, alt, className = '' }: ZoomableImageProps) {
  return (
    <div className="overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={`transform transition-transform duration-300 hover:scale-110 ${className}`}
      />
    </div>
  );
});