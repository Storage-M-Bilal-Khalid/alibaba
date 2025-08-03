import { useState, useEffect } from 'react';

export const useWindowWidth = (breakpoint: number = 950): boolean => {
    const [isBelowBreakpoint, setIsBelowBreakpoint] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setIsBelowBreakpoint(window.innerWidth < breakpoint);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [breakpoint]);

    return isBelowBreakpoint;
};
