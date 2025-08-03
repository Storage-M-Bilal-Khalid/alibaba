"use client"
import { useWindowWidth } from "@/hooks/useWindowWidth";
import SupplierDataDisplay from "./SupplierDataDisplay";

export default function SuppliersByRegionSection() {
    interface SupplierRegion {
        id: number;
        country: string;
        shopname: string;
        imgUrl: string;
    }
    const suppliersByRegion: SupplierRegion[] = [
        {
            id: 1,
            country: "Arabic Emirates",
            shopname: "shopname.ae",
            imgUrl: "/assets/Layout1/Image/flags/UAE.png",
        },
        {
            id: 2,
            country: "Australia",
            shopname: "shopname.ae",
            imgUrl: "/assets/Layout1/Image/flags/AUSTRALIA.png",
        },
        {
            id: 3,
            country: "United States",
            shopname: "shopname.ae",
            imgUrl: "/assets/Layout1/Image/flags/US.png",
        },
        {
            id: 4,
            country: "Russia",
            shopname: "shopname.ru",
            imgUrl: "/assets/Layout1/Image/flags/RUSSIA.png",
        },
        {
            id: 5,
            country: "Italy",
            shopname: "shopname.it",
            imgUrl: "/assets/Layout1/Image/flags/ITALY.png",
        },
        {
            id: 6,
            country: "Denmark",
            shopname: "denmark.com.dk",
            imgUrl: "/assets/Layout1/Image/flags/DENMARK.png",
        },
        {
            id: 7,
            country: "France",
            shopname: "shopname.com.fr",
            imgUrl: "/assets/Layout1/Image/flags/FRANCE.png",
        },
        {
            id: 8,
            country: "Germany",
            shopname: "shopname.ae",
            imgUrl: "/assets/Layout1/Image/flags/GERMANY.png",
        },
        {
            id: 9,
            country: "China",
            shopname: "shopname.ae",
            imgUrl: "/assets/Layout1/Image/flags/CHINA.png",
        },
        {
            id: 10,
            country: "Great Britain",
            shopname: "shopname.co.uk",
            imgUrl: "/assets/Layout1/Image/flags/BRITIAN.png",
        },
    ];
    const firstRowSuppliers = suppliersByRegion.slice(0, 5);
    const secondRowSuppliers = suppliersByRegion.slice(5, 10);
    const innerWidth = useWindowWidth(950);
    return (
        <>
            {
                !innerWidth
                    ?
                    <>
                        <section className="w-full flex flex-col space-y-4">
                            <h1 className="font-bold text-2xl text-[#1c1c1c]">Suppliers by regions</h1>
                            <div className="w-full grid grid-rows-[1fr_1fr] gap-4">
                                <div className="w-full grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-5">
                                    {
                                        firstRowSuppliers.map((currentValue, index) => (
                                            <SupplierDataDisplay key={index} imgUrl={currentValue.imgUrl} country={currentValue.country} shopname={currentValue.shopname} />
                                        ))
                                    }
                                </div>
                                <div className="w-full grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-5">
                                    {
                                        secondRowSuppliers.map((currentValue, index) => (
                                            <SupplierDataDisplay key={index} imgUrl={currentValue.imgUrl} country={currentValue.country} shopname={currentValue.shopname} />
                                        ))
                                    }
                                </div>
                            </div>
                        </section>
                    </>
                    :
                    <h1>Supplier By Region Section</h1>
            }
        </>
    )
}









