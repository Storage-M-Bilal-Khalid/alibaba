"use client"
import { recommendedProducts } from "@/components/shared/ProductDetail/configuration";

export default function RelatedProducts() {
    return (
        <section className="border-1 border-[#dee2e7] p-4 bg-white rounded-[5] grid grid-rows-[0.9fr_5fr]">
            <p className=" text-[#1c1c1c] p-0 m-0 font-semibold">Related Products</p>
            <div className="flex justify-between">
                {
                    recommendedProducts.map(
                        (cv, index) => (
                            <div className="grid grid-rows-[3.5fr_1fr]  gap-x-10" key={index}>
                                <div className="flex justify-center items-center border-1 border-[#eeeeee] rounded-[5] cursor-pointer">
                                    <img src={cv.imgUrl} alt="Product image" className="w-40 h-40  rounded-[5]" />
                                </div>
                                <div className="flex flex-col space-y-0.5 pt-2">
                                    <h1 className="text-[#505050] cursor-pointer hover:underline hover:text-[#0d6efd] transition-all duration-150 ease-in-out">{cv.name}</h1>
                                    <p className="text-[#8b96a5] text-sm">{cv.priceRange}</p>
                                </div>
                            </div>
                        )
                    )
                }

            </div>
        </section>
    );
}






