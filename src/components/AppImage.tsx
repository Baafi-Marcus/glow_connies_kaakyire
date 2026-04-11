"use client";

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface AppImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallback?: string;
}

export default function AppImage({ 
  src, 
  fallback = '/logo.png', // Using logo as fallback for now
  alt, 
  ...props 
}: AppImageProps) {
  const [error, setError] = useState(false);
  
  const imageSrc = !src || error ? fallback : src;

  return (
    <Image
      src={imageSrc}
      alt={alt || "Image"}
      {...props}
      onError={() => setError(true)}
      className={`object-cover ${props.className || ''}`}
    />
  );
}
