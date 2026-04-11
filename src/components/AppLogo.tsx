import Image from 'next/image';

interface AppLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function AppLogo({ className = "", width = 40, height = 40 }: AppLogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width, height }}>
      <Image
        src="/logo.png"
        alt="Glow by Connie Logo"
        width={width}
        height={height}
        className="object-contain rounded-full"
      />
    </div>
  );
}
