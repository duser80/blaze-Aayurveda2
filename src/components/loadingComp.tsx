import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ size = 'default' }: { size?: 'small' | 'default' | 'large', text?: string }) {
    const sizeClasses = {
        small: 'w-4 h-4',
        default: 'w-8 h-8',
        large: 'w-12 h-12'
    }

    return (
        <div className="flex items-center justify-center space-x-2">
            <Loader2 className={`animate-spin ${sizeClasses[size]} text-primary`} />
        </div>
    )
}