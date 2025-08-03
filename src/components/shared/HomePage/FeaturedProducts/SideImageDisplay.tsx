import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SideImageDisplayProps {
    text: string,
    imgUrl: string
}

export default function SideImageDisplay({ text, imgUrl }: SideImageDisplayProps) {
    return (
        <div className="relative h-auto flex-1">
            <div className={cn("absolute inset-0 z-20 flex flex-col left-3 items-start justify-start")}>
                <h1 className="text-2xl font-semibold text-[#1c1c1c] pt-6 tracking-tight">
                    <span dangerouslySetInnerHTML={{ __html: text }} />
                </h1>
                <Button className="mt-5 pl-4 pr-4 pt-2 pb-2 rounded-[5] text-[#1c1c1c]  bg-white border-[#DEE2E7] hover:tracking-wide transition-all duration-300 ease-in-out   hover:cursor-pointer" variant="default">Source now</Button>
            </div>
            <Image
                src={imgUrl}
                alt="Banner Hero Section"
                fill
                className="object-cover rounded-tl-[8] rounded-bl-[8]"
                sizes="100%"
                priority
            />
        </div>
    )
}