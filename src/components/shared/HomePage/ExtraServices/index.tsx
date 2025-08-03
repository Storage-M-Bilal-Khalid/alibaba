"use client"
import { useWindowWidth } from '@/hooks/useWindowWidth';
import { LucideIcon, Palette, Search, Send, ShieldCheck } from 'lucide-react';

export default function ExtraServicesSection() {

    interface Service {
        id: number;
        title: string;
        imgUrl: string;
        Icon: LucideIcon;
    }

    const extraServices: Service[] = [
        {
            id: 1,
            title: "Source from <br/> Industry Hubs",
            imgUrl: "/assets/Image/backgrounds/image4.png",
            Icon: Search,
        },
        {
            id: 2,
            title: "Customize Your <br/> Products",
            imgUrl: "/assets/Image/backgrounds/image3.png",
            Icon: Palette,
        },
        {
            id: 3,
            title: "Fast, reliable shipping <br/> by ocean or air",
            imgUrl: "/assets/Image/backgrounds/image1.png",
            Icon: Send,
        },
        {
            id: 4,
            title: "Product monitoring <br/> and inspection",
            imgUrl: "/assets/Image/backgrounds/image2.png",
            Icon: ShieldCheck,
        },
    ];
    const innerWidth = useWindowWidth(950);
    return (
        <>
            {
                !innerWidth
                ?
                <>
                    <section className="w-full flex flex-col space-y-4">
                <h1 className="font-bold text-2xl text-[#1c1c1c]">
                    Our extra services
                </h1>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {
                        extraServices.map((currentValue, index) => (
                            <div key={index} className="border border-[#e0e0e0] rounded-lg overflow-hidden flex flex-col">
                                <div className="relative w-full aspect-video">
                                    <img
                                        src={currentValue.imgUrl}
                                        alt="Product pic"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4 bg-white flex flex-col justify-start items-start flex-grow relative">
                                    <p className="font-semibold text-sm text-[#1c1c1c] inline-block" dangerouslySetInnerHTML={{ __html: currentValue.title }}>
                                    </p>
                                    <div className="border-2 border-white bg-blue-200 rounded-full w-15 h-15 absolute right-8 bottom-[45px] flex justify-center items-center">
                                        <currentValue.Icon className="w-6 h-6 text-[#1c1c1c] font-semibold" />
                                    </div>

                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>
                </>
                :
                <h1>Extra Services Section</h1>
            }
        </>
    )
}







