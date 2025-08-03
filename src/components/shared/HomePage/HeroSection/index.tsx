"use client"
import { Button } from "@/components/ui/button";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { cn } from "@/lib/utils";
import { UserRound } from "lucide-react";
import { BannerDisplay } from "./BannerDisplay";


export default function HeroSection() {
    const inner_width  = useWindowWidth(950);
    const inwidth = useWindowWidth(1100);

    interface Category {
        id: number;
        name: string;
        slug?: string;
    }

    const categories: Category[] = [
        { id: 1, name: "Automobiles", slug: "automobiles" },
        { id: 2, name: "Clothes and wear", slug: "clothes-and-wear" },
        { id: 3, name: "Home interiors", slug: "home-interiors" },
        { id: 4, name: "Computer and tech", slug: "computer-and-tech" },
        { id: 5, name: "Tools, equipments", slug: "tools-equipments" },
        { id: 6, name: "Sports and outdoor", slug: "sports-and-outdoor" },
        { id: 7, name: "Animal and pets", slug: "animal-and-pets" },
        { id: 8, name: "Machinery tools", slug: "machinery-tools" },
        { id: 9, name: "More category", slug: "more-category" }
    ];
    
    return (
        <>
            {
                !inner_width
                    ?
                    <section className="w-full grid grid-cols-[0.65fr_2.5fr_0.85fr] gap-4 bg-white p-3 rounded-[5] border-1 border-[#8B96A5] mt-5">
                        <div className={cn("flex flex-col ",
                            inwidth ? 'gap-y-3.5' : 'gap-y-1.5'
                        )}>
                            {
                                categories.map((currentValue, index) => (
                                    <Button variant="link" key={index} className="flex justify-start p-2 cursor-pointer hover:bg-[#E5F1FF] text-[#505050] rounded-[5] font-[450]">
                                        {
                                            currentValue.name
                                        }
                                    </Button>
                                ))
                            }
                        </div>
                        <BannerDisplay/>
                        <div className="pl-2 pr-2 container grid grid-rows-[1.5fr_0.75fr_0.75fr] gap-y-2.5">
                            <div className="bg-[#E3F0FF] rounded-[5] p-3">
                                <div className="flex flex-row gap-x-3">
                                    <div className="w-12 h-12 rounded-full bg-[#C7E1FF] flex items-end justify-center pt-1 ">
                                        <UserRound className="h-9 w-14 text-white" />
                                    </div>
                                    <p className="font-[450]">
                                        Hi,user <br /> let's get started
                                    </p>
                                </div>
                                <div className="flex flex-col space-y-2 mt-[12px]">
                                    <Button className="p-2 rounded-[5] bg-[#0A74FF] text-white border-1 border-[#DEE2E7] hover:tracking-wide transition-all duration-300 ease-in-out  hover:cursor-pointer" variant="default">Join now</Button>
                                    <Button className="p-2 rounded-[5] text-[#0A74FF] bg-white border-[#DEE2E7] hover:tracking-wide transition-all duration-300 ease-in-out   hover:cursor-pointer" variant="default">Log in</Button>
                                </div>
                            </div>
                            <p className="bg-[#F38332] rounded-[5] p-3 text-white">
                                Get US $10 off with a new supplier
                            </p>
                            <p className="bg-[#55BDC3] rounded-[5] p-3 text-white">
                                Send quotes with supplier preferences
                            </p>
                        </div>
                    </section>
                    :
                    <section className="bg-white p-0 mt-5">
                        <BannerDisplay/>
                    </section>
            }
        </>
    )
}

