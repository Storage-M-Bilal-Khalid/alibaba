"use client"
import DiscountTimer from "@/components/shared/HomePage/FeaturedProducts/DiscountTimer";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { cn } from "@/lib/utils";
import Image from "next/image";
import SideImageDisplay from "./SideImageDisplay";

export default function FeaturedProducts() {
    const inner_width = useWindowWidth(950);
    const productDisplayInHomePage = [
        {
            name: "Smart watches",
            value: "smartWatches",
            discount: 25,
            url: "/Image/tech/8.jpg"
        },
        {
            name: "Laptops",
            value: "smartWatches",
            discount: 15,
            url: "/Image/tech/7.jpg"
        },
        {
            name: "GoPro Camera",
            value: "cameras",
            discount: 40,
            url: "/Image/tech/6.jpg"
        },
        {
            name: "Headphones",
            value: "headPhones",
            discount: 25,
            url: "/Image/tech/5.jpg"
        },
        {
            name: "Smart Phones",
            value: "smartPhones",
            discount: 25,
            url: "/Image/tech/3.jpg"
        },
    ];
    const adminDiscountEndDate: string = "2025-08-01T23:59:59";
    const homeAndOutdoorProductsDisplay = [
        {
            title: "Soft chairs",
            value: "softChairs",
            fromPrice: 19,
            imgUrl: "/Image/interior/1.jpg"
        },
        {
            title: "Sofa & chairs",
            value: "sofa&Chairs",
            fromPrice: 39,
            imgUrl: "/Image/interior/6.jpg"
        },
        {
            title: "Kitchen dishes",
            value: "kitchenDishes",
            fromPrice: 59,
            imgUrl: "/Image/interior/5.jpg"
        },
        {
            title: "Smart watches",
            value: "smartWatches",
            fromPrice: 88,
            imgUrl: "/Image/interior/3.jpg"
        },
        {
            title: "Kitchen mixers",
            value: "kitchenMixers",
            fromPrice: 99,
            imgUrl: "/Image/interior/9.jpg"
        },
        {
            title: "Blenders",
            value: "blenders",
            fromPrice: 33,
            imgUrl: "/Image/interior/8.jpg"
        },
        {
            title: "Home appliances",
            value: "homeAppliances",
            fromPrice: 77,
            imgUrl: "/Image/interior/7.jpg"
        },
        {
            title: "Coffee maker",
            value: "coffeeMaker",
            fromPrice: 15,
            imgUrl: "/Image/interior/4.jpg"
        },
        {
            title: "Smart watches",
            value: "smartWatches",
            fromPrice: 19,
            imgUrl: "/Image/tech/8.jpg"
        },
        {
            title: "Cameras",
            value: "cameras",
            fromPrice: 89,
            imgUrl: "/Image/tech/6.jpg"
        },
        {
            title: "Headphones",
            value: "headphones",
            fromPrice: 10,
            imgUrl: "/Image/tech/9.jpg"
        },
        {
            title: "Smart watches",
            value: "smartWatches2",
            fromPrice: 90,
            imgUrl: "/Image/tech/8.jpg"
        },
        {
            title: "Gaming set",
            value: "gamingSet",
            fromPrice: 35,
            imgUrl: "/Image/tech/5.jpg"
        },
        {
            title: "Laptops & PC",
            value: "laptopsPc",
            fromPrice: 340,
            imgUrl: "/Image/tech/7.jpg"
        },
        {
            title: "Smartphones",
            value: "smartphones",
            fromPrice: 19,
            imgUrl: "/Image/tech/1.jpg"
        },
        {
            title: "Electric kattle",
            value: "electricKettle",
            fromPrice: 240,
            imgUrl: "/Image/tech/10.jpg"
        },
    ];
    const firstRowProducts = homeAndOutdoorProductsDisplay.slice(0, 4);
    const secondRowProducts = homeAndOutdoorProductsDisplay.slice(4, 8);
    const thirdRowProducts = homeAndOutdoorProductsDisplay.slice(8, 12);
    const fourRowProducts = homeAndOutdoorProductsDisplay.slice(12, 16);
    return (
        <>
            {
                !inner_width
                    ?
                    <>
                        <section className="bg-white">
                            <div className="w-full h-auto grid grid-cols-[0.3375fr_1fr]  rounded-[5] border-1 border-[#8B96A5]">
                                <div className="pt-4 pl-5 md:pl-3 lg:pl-3">
                                    <h1 className="font-bold text-xl text-[#1c1c1c]">Deals and offers</h1>
                                    <p className="text-[#8B96A5]">Hygiene equipments</p>
                                    <DiscountTimer discountEndDate={adminDiscountEndDate} />
                                </div>
                                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] lg:grid md:grid md:grid-cols-[1fr_1fr_1fr_1fr] lg:grid-cols-[1fr_1fr_1fr_1fr]">
                                    {
                                        productDisplayInHomePage.map((currentValue, index) => (
                                            <div
                                                key={index}
                                                // Conditionally hide the last item on 'lg' screens
                                                className={`relative border-l-1 border-[#8B96A5] flex flex-col gap-y-1 items-center justify-center pb-[14px] 
                    ${index === productDisplayInHomePage.length - 1 ? 'lg:hidden md:hidden' : ''}`}
                                            >
                                                <Image src={currentValue.url} alt="Product image" className="object-cover cursor-pointer" width={200} height={200} priority />
                                                <p className="text-[#1c1c1c]">{currentValue.name}</p>
                                                <div className="rounded-[22] pl-4 pr-4 pt-1 pb-1 bg-[#FFE3E3] text-[#EB001B] font-semibold cursor-pointer">-{currentValue.discount}%</div>
                                            </div>
                                        ))
                                    }
                                </div>
                                {/* <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] lg:grid lg:grid-cols-[1fr_1fr_1fr_1fr]">
                        {
                            productDisplayInHomePage.map((currentValue, index) => (
                                <div key={index} className="relative border-l-1 border-[#8B96A5] flex flex-col gap-y-1 items-center justify-center pb-[14px]">
                                    <Image src={currentValue.url} alt="Product image" className="object-cover cursor-pointer" width={200} height={200} priority />
                                    <p className="text-[#1c1c1c]">{currentValue.name}</p>
                                    <div className="rounded-[22] pl-4 pr-4 pt-1 pb-1 bg-[#FFE3E3] text-[#EB001B] font-semibold cursor-pointer">-{currentValue.discount}%</div>
                                </div>
                            ))
                        }
                    </div> */}
                            </div>
                            <div></div>
                            <div></div>
                        </section>
                        <section className="flex flex-col">
                            <div className="w-full h-auto grid grid-cols-[0.3375fr_1fr]  rounded-[7] border-1 border-[#8B96A5] bg-white">
                                <SideImageDisplay text="Home and <br/> outdoor" imgUrl="/assets/Image/backgrounds/BannerSecondSection.png" />
                                <div className="flex flex-col h-[260px]">
                                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr] flex-grow">
                                        {firstRowProducts.map((product, index) => (
                                            <div key={index} className={cn("flex flex-col relative pt-3 pl-4", index === 0 ? null : "border-l-1 border-[#8B96A5] ")}>
                                                <>
                                                    <h1 className="font-[450px] hover:tracking-wide transition-all duration-300 ease-in-out hover:underline hover:cursor-pointer hover:text-[#026bffb6]">{product.title}</h1>
                                                    <p className="text-[#8B96A5]">From<br />USD {product.fromPrice}</p>
                                                </>
                                                <img src={product.imgUrl} alt={product.title} className="w-[82px] h-[82px] absolute right-0 bottom-0" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr] flex-grow border-t-1 border-[#8B96A5]">
                                        {secondRowProducts.map((product, index) => (
                                            <div key={index} className={cn("flex flex-col relative pt-3 pl-4", index === 0 ? null : "border-l-1 border-[#8B96A5] ")}>
                                                <>
                                                    <h1 className="font-[450px] hover:tracking-wide transition-all duration-300 ease-in-out hover:underline hover:cursor-pointer hover:text-[#026bffb6]">{product.title}</h1>
                                                    <p className="text-[#8B96A5]">From<br />USD {product.fromPrice}</p> {/* Assuming "Price" should also be "From USD" */}
                                                </>
                                                <img src={product.imgUrl} alt={product.title} className="w-[82px] h-[82px] absolute right-0 bottom-0" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="w-full h-auto grid grid-cols-[0.3375fr_1fr]  mt-5 rounded-[5] border-1 border-[#8B96A5] bg-white">
                                <SideImageDisplay text="Consumer <br /> electronics and <br /> gadgets" imgUrl="/assets/Image/backgrounds/BannerThirdSection.png" />
                                <div className="flex flex-col h-[260px]">
                                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr] flex-grow ">
                                        {thirdRowProducts.map((product, index) => (
                                            <div key={index} className={cn("flex flex-col relative pt-3 pl-4", index === 0 ? null : "border-l-1 border-[#8B96A5] ")}>
                                                <>
                                                    <h1 className="font-[450px] hover:tracking-wide transition-all duration-300 ease-in-out hover:underline hover:cursor-pointer hover:text-[#026bffb6]">{product.title}</h1>
                                                    <p className="text-[#8B96A5]">From<br />USD {product.fromPrice}</p>
                                                </>
                                                <img src={product.imgUrl} alt={product.title} className="w-[82px] h-[82px] absolute right-0 bottom-0" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr] flex-grow border-t-1 border-[#8B96A5]">
                                        {fourRowProducts.map((product, index) => (
                                            <div key={index} className={cn("flex flex-col relative pt-3 pl-4", index === 0 ? null : "border-l-1 border-[#8B96A5] ")}>
                                                <>
                                                    <h1 className="font-[450px] hover:tracking-wide transition-all duration-300 ease-in-out hover:underline hover:cursor-pointer hover:text-[#026bffb6]">{product.title}</h1>
                                                    <p className="text-[#8B96A5]">From<br />USD {product.fromPrice}</p>
                                                </>
                                                <img src={product.imgUrl} alt={product.title} className="w-[82px] h-[82px] absolute right-0 bottom-0" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                    :
                    <h1>
                        Featured Product Section
                    </h1>
            }

        </>
    )
}
