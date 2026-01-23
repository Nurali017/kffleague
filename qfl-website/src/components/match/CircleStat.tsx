'use client';

interface CircleStatProps {
    label: string;
    value: string | number;
    subValue?: string;
    color: string;
    logoUrl?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function CircleStat({
    label,
    value,
    subValue,
    color,
    logoUrl,
    size = 'md'
}: CircleStatProps) {

    const sizeClasses = {
        sm: 'w-24 h-24 text-2xl',
        md: 'w-32 h-32 text-3xl',
        lg: 'w-40 h-40 text-4xl'
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className={`
          relative rounded-full border-4 flex flex-col items-center justify-center bg-white shadow-sm
          ${sizeClasses[size]}
        `}
                style={{ borderColor: color }}
            >
                {/* Logo background watermark */}
                {logoUrl && (
                    <img
                        src={logoUrl}
                        alt=""
                        className="absolute inset-0 w-full h-full object-contain opacity-10 p-4"
                    />
                )}

                <span className="font-black text-gray-900 leading-none z-10">
                    {value}
                </span>

                {subValue && (
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide z-10 mt-1">
                        {subValue}
                    </span>
                )}
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center max-w-[120px]">
                {label}
            </span>
        </div>
    );
}
