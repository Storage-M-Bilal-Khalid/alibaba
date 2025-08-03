import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

const MaxWidthWrapper = ({
    className,
    children,
}: {
    className?: string
    children: ReactNode
}) => {
    return (
        <div
            className={cn(
                ' mx-auto w-full max-w-screen-xl px-4.5 sm:pl-5 sm:pr-5 ',
                className
            )}>
            {children}
        </div>
    )
}

export default MaxWidthWrapper

// mx-auto w-full max-w-screen-xl px-4.5 sm:pl-5 sm:pr-5 