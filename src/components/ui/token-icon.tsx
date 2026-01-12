
import { cn } from '@/lib/utils';
import { GalleryVerticalEnd } from 'lucide-react';

const SparkIcon = (props: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 68 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fillRule="evenodd" clipRule="evenodd" d="M39.68 24.656L40.836 0H26.398l1.156 24.656-23.092-8.718L0 29.668l23.807 6.52L8.38 55.457l11.68 8.487 13.558-20.628 13.558 20.627 11.68-8.486L43.43 36.188l23.804-6.52-4.461-13.73-23.092 8.718zM33.617 33v.001z" fill="currentColor"></path></svg>;
const LiquidIcon = (props: React.HTMLAttributes<HTMLImageElement>) => <img src="https://liquid.net/_next/static/media/logo.28b5ba97.svg" alt="Liquid Network Logo" {...props} />;
const RgbIcon = (props: React.HTMLAttributes<HTMLImageElement>) => <img src="https://rgb.tech/logo/rgb-symbol-color.svg" alt="RGB Protocol Logo" {...props} />;

interface TokenIconProps extends React.HTMLAttributes<HTMLElement> {
    network: string;
}

export default function TokenIcon({ network, className }: TokenIconProps) {
    const iconMap: { [key: string]: React.ReactNode } = {
        spark: <SparkIcon className={cn("h-full w-full p-1", className)} />,
        liquid: <LiquidIcon className={cn("h-full w-full p-1", className)} />,
        rgb: <RgbIcon className={cn("h-full w-full p-1", className)} />,
    };

    const icon = iconMap[network];

    return (
        <div className={cn("flex items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground", className)}>
            {icon || <GalleryVerticalEnd className="h-full w-full p-1.5" />}
        </div>
    );
}
