
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function BannerDisplay() {
    return (
        <div className="relative min-h-[300px] flex-1">
            <div className={cn("absolute inset-0 z-20 flex flex-col left-3 md:left-8 items-start justify-center")}>
                <h2 className="sm:font-semibold text-2xl tracking-wide text-[#1c1c1c]">
                    Latest trending
                </h2>
                <h1 className="sm:font-bold text-4xl tracking-wide text-[#1c1c1c]">
                    Electronic items
                </h1>
                <Button className="mt-5 pl-10 pr-10 pt-3 pb-3 rounded-[5] text-[#1c1c1c] bg-white border-[#DEE2E7] hover:tracking-wide transition-all duration-300 ease-in-out   hover:cursor-pointer" variant="default">Learn more</Button>
            </div>
            <Image
                src="/assets/Image/backgrounds/Banner.png"
                alt="Banner Hero Section"
                fill
                className="object-cover rounded-[7]"
                sizes="100%"
                priority
            />
        </div>
    )
}