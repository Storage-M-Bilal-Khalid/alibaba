"use client"
import React, { useEffect, useState } from 'react';

interface DiscountTimerProps {
    discountEndDate: string;
}

interface TimeLeftState {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
}

export default function DiscountTimer({ discountEndDate }: DiscountTimerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeftState>({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
    });
    const [timerExpired, setTimerExpired] = useState<boolean>(false);

    useEffect(() => {
        const calculateTimeLeft = (): TimeLeftState | {} => {
            const difference: number = +new Date(discountEndDate) - +new Date();
            let newTimeLeft: TimeLeftState | {} = {};

            if (difference > 0) {
                newTimeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, '0'),
                    minutes: Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, '0'),
                    seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, '0'),
                };
            } else {
                setTimerExpired(true);
            }
            return newTimeLeft;
        };

        const initialTime = calculateTimeLeft();
        if ('days' in initialTime) {
            setTimeLeft(initialTime as TimeLeftState);
        }

        const timer = setInterval(() => {
            const updatedTimeLeft = calculateTimeLeft();
            if (Object.keys(updatedTimeLeft).length === 0 && timerExpired) {
                clearInterval(timer);
            }
            if ('days' in updatedTimeLeft) {
                setTimeLeft(updatedTimeLeft as TimeLeftState);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [discountEndDate, timerExpired]);

    const timerSlots = [
        { display: timeLeft.days, slot: "Days", value: "days" },
        { display: timeLeft.hours, slot: "Hours", value: "hours" },
        { display: timeLeft.minutes, slot: "Minutes", value: "minutes" },
        { display: timeLeft.seconds, slot: "Seconds", value: "seconds" },
    ];

    return (
        <div className="flex pt-5 space-x-1">
            {timerExpired ? (
                <p>Discount has ended!</p>
            ) : (
                timerSlots.map((currentValue: { display: string; slot: string; value: string }, index: number) => (
                    <div key={index} className="bg-[#606060] text-white w-[60px] h-[65px] md:w-[50] md:h-[50] lg:w-[50] lg:h-[50] rounded-[8px] flex flex-col items-center justify-center">
                        <h1 className="font-bold tracking-wider">{currentValue.display}</h1>
                        <p className='text-sm'>
                            <span className="hidden md:inline lg:inline">
                                {currentValue.slot.slice(0, 3)}
                            </span>
                            <span className="md:hidden lg:hidden">
                                {currentValue.slot}
                            </span>
                        </p>
                    </div>
                ))
            )}
        </div>
    );
};