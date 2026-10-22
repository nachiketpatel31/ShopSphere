import React, { useState } from 'react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

export const ImageWithFallback = ({
  src,
  alt = 'Product image',
  className = '',
  fallbackSrc = FALLBACK_IMAGE,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc || fallbackSrc}
      alt={alt}
      onError={handleError}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};
