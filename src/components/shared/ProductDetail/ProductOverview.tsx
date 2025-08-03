"use client"
import { recommendedProducts } from "./configuration";
import { ProductOverviewTabs } from "./ProductOverviewTabs";

export default function ProductOverview() {  
    return (
            <section className="grid grid-cols-[6fr_2fr] gap-x-5 ">
                <ProductOverviewTabs />
                <div className="flex flex-col space-y-3 bg-white border-1 border-[#dee2ef] rounded-[5] p-4 h-[500px]">
                    <h1 className="font-semibold text-[#1c1c1c]">
                        You may like
                    </h1>
                    {
                        recommendedProducts.map(
                            (currentValue, index) => (
                                <div className="grid grid-cols-[1fr_2.5fr] gap-x-3" key={index}>
                                    <div
                                        className="border border-[#dee2ef] rounded-[5px]"
                                    >
                                        <img
                                            src={currentValue.imgUrl}
                                            alt="Product Image"
                                            className="w-full h-full object-contain rounded-[5px] cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <h1 className="text-[#505050] cursor-pointer hover:underline hover:text-[#0d6efd] transition-all duration-150 ease-in-out">
                                            {currentValue.name}
                                        </h1>
                                        <p className="text-[#8b96a5] text-sm">
                                            {currentValue.priceRange}
                                        </p>
                                    </div>
                                </div>
                            )
                        )
                    }
                </div >
            </section >        
    );
}





