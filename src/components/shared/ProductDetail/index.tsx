"use client"
import DiscountBanner from "@/components/shared/ProductDetail/DiscountBanner";
import ProductDisplaySection from "@/components/shared/ProductDetail/ProductDisplaySection";
import ProductOverview from "@/components/shared/ProductDetail/ProductOverview";
import RelatedProducts from "@/components/shared/ProductDetail/RelatedProducts";
import Breadcrumbs from "@/components/shared/ProductPage/Breadcrumbs";
import { ProductGrouped } from "../Dashboard/Seller/data";

interface ProductDetailProps{
    product:ProductGrouped
}

export default function ProductDetail({product}:ProductDetailProps) {
    const handleShopNow = () => {
        alert('Shop now button clicked!');
    };
    return (
        <div className="flex flex-col space-y-4">
            <Breadcrumbs />
            <ProductDisplaySection product={product}/>
            <ProductOverview />
            <RelatedProducts />
            <DiscountBanner
                title="Super discount on more than 100 USD"
                description="Have you ever finally just write dummy info"
                buttonText="Shop now"
                onButtonClick={handleShopNow}
            />
        </div>
    );
}







