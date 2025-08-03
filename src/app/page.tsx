import FeaturedProducts from "@/components/shared/HomePage/FeaturedProducts";
import ExtraServicesSection from "@/components/shared/HomePage/ExtraServices";
import HeroSection from "@/components/shared/HomePage/HeroSection";
import InquiryFormSection from "@/components/shared/HomePage/InquiryFormSection";
import RecommendedProducts from "@/components/shared/HomePage/RecommendedProducts";
import SuppliersByRegionSection from "@/components/shared/HomePage/SuppliersByRegionSection";



export default function Home() {
    return (
        <>
            <div className="flex flex-col space-y-5">
                <HeroSection />
                <FeaturedProducts />
                <InquiryFormSection />
                <RecommendedProducts />
                <ExtraServicesSection />
                <SuppliersByRegionSection />
            </div>
        </>
    )
}








