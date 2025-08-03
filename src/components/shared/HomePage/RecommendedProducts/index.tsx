"use client"
import { useWindowWidth } from "@/hooks/useWindowWidth";

export default function RecommendedProducts() {
    interface RecommendedProductsProps {
        id: number;
        name: string;
        price: number;
        description: string;
        imgUrl: string;
    }

    const recommendedProducts: RecommendedProductsProps[] = [
        {
            id: 1,
            name: "T-shirts",
            price: 10.30,
            description: "T-shirts with multiple colors, for men",
            imgUrl: "/Image/cloth/1.jpg",
        },
        {
            id: 2,
            name: "Jeans shorts",
            price: 10.30,
            description: "Jeans shorts for men blue color",
            imgUrl: "/Image/cloth/2.jpg",
        },
        {
            id: 3,
            name: "Brown winter coat",
            price: 12.50,
            description: "Brown winter coat medium size",
            imgUrl: "/Image/cloth/3.jpg",
        },
        {
            id: 4,
            name: "Jeans bag",
            price: 34.00,
            description: "Jeans bag for travel for men",
            imgUrl: "/Image/cloth/4.jpg",
        },
        {
            id: 5,
            name: "Leather wallet",
            price: 99.00,
            description: "Leather wallet",
            imgUrl: "/Image/cloth/5.jpg",
        },
        {
            id: 6,
            name: "Canon camera",
            price: 9.99,
            description: "Canon camera black, 100x zoom",
            imgUrl: "/Image/cloth/6.jpg",
        },
        {
            id: 7,
            name: "Headset for gaming",
            price: 8.99,
            description: "Headset for gaming with mic",
            imgUrl: "/Image/cloth/7.jpg",
        },
        {
            id: 8,
            name: "Smartwatch",
            price: 10.30,
            description: "Smartwatch silver color modern",
            imgUrl: "/Image/cloth/1.jpg",
        },
        {
            id: 9,
            name: "Blue wallet",
            price: 10.30,
            description: "Blue wallet for men leather material",
            imgUrl: "/Image/cloth/2.jpg",
        },
        {
            id: 10,
            name: "Jeans bag",
            price: 80.95,
            description: "Jeans bag for travel for men",
            imgUrl: "/Image/cloth/3.jpg",
        },
    ];

    const firstRowRecommendedProducts = recommendedProducts.slice(0, 5);
    const secondRowRecommendedProducts = recommendedProducts.slice(5, 10);

    const innerWidth = useWindowWidth(950);

    return (
        <>
            {
                !innerWidth
                    ?
                    <>
                        <section className="w-full flex flex-col space-y-4">
                            <h1 className="font-bold text-2xl text-[#1c1c1c]">Recommended items</h1>
                            <div className="w-full grid grid-rows-[1fr_1fr]  gap-4">
                                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-4">
                                    {
                                        firstRowRecommendedProducts.map((currentValue, index) => (
                                            <div key={index} className="border-1 border-[#e0e0e0] grid grid-rows-[0.55fr_0.25fr] bg-white rounded-[10]">
                                                <div className="flex items-center justify-center relative">
                                                    <img src={currentValue.imgUrl} alt="Product pic" className="w-full h-full object-contain rounded-[20]" />
                                                </div>
                                                <div className="p-3 flex flex-col">
                                                    <h1 className="font-semibold text-[#1c1c1c]">${currentValue.price}</h1>
                                                    <p className="text-[#1c1c1c] hover:underline hover:cursor-pointer transition-all duration-300 ease-in-out hover:tracking-wide hover:text-[#026bffb6]">{currentValue.name}</p>
                                                    <p className="text-[#8b96a5] text-sm">{currentValue.description}</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-4">
                                    {
                                        secondRowRecommendedProducts.map((currentValue, index) => (
                                            <div key={index} className="border-1 border-[#e0e0e0] grid grid-rows-[0.55fr_0.25fr] bg-white rounded-[10]">
                                                <div className="flex items-center justify-center relative">
                                                    <img src={currentValue.imgUrl} alt="Product pic" className="w-full h-full object-contain rounded-[20]" />
                                                </div>
                                                <div className="p-3 flex flex-col">
                                                    <h1 className="font-semibold text-[#1c1c1c]">${currentValue.price}</h1>
                                                    <p className="text-[#1c1c1c] hover:underline hover:cursor-pointer transition-all duration-300 ease-in-out hover:tracking-wide hover:text-[#026bffb6]">{currentValue.name}</p>
                                                    <p className="text-[#8b96a5] text-sm">{currentValue.description}</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </section>
                    </>
                    :
                    <h1>Recommeded Product Section</h1>
            }
        </>
    )
}







