"use client";

import { Icons } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, Menu, MessageSquareMore, Search, ShoppingCart, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CategoryData, productCategories } from "../ProductPage/configuration/configuration";
import { usePathname } from "next/navigation";
import { ProductGrouped } from "../Dashboard/Seller/data";
import { useProduct } from "@/hooks/ProductContext";


export default function DesktopMainHeader() {

    const pathname = usePathname();


    const searchSchema = z.object({
        searchTerm: z.string().min(1, { message: "Search term cannot be empty." }),
        category: z.string().transform(e => e === "" ? "all" : e),
    });

    type SearchFormValues = z.infer<typeof searchSchema>;
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<SearchFormValues>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            searchTerm: "",
            category: "",
        },
    });

    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);

    const handleCategorySelect = (category: CategoryData) => {
        setSelectedCategory(category);
    };

    const { setLoading, setProduct } = useProduct();


    const onSubmit = (searchDemandData: SearchFormValues) => {
        console.log("Search submitted:", searchDemandData);
        alert(`Searching for "${searchDemandData.searchTerm}" in category: "${searchDemandData.category}"`);
        const queryParams = new URLSearchParams({
            productTitle: searchDemandData.searchTerm,
            category: searchDemandData.category,
        }).toString();
        const viewProducts = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/view-products/customers?${queryParams}`, {
                    method: 'GET',
                });
                if (!res.ok) {
                    console.log(`Error`);
                    setLoading(false);
                    return;
                };
                const data = await res.json();
                if (data && data.result) {
                    setProduct(data.result)
                    setLoading(false);
                    console.log(`Fetched Products : `, data.result)
                } else {
                    console.log(`Error`);
                    setLoading(false);
                }
            } catch (error) {
                console.log(`Error`);
                setLoading(false);
            }
        };
        viewProducts();
    };

    const inner_width = useWindowWidth(1100);

    return (
        <>
            <nav className={cn("flex items-center justify-between pt-4 pb-4  h-[70px]")}>
                <div className="flex items-center gap-6">
                    <div className="rounded-md">
                        <Icons.logo className='h-10 w-10' />
                    </div>
                </div>
                <div className={cn("flex items-center", inner_width ? "ml-30" : "ml-35")}>
                    {
                        pathname.includes("/products")
                        &&
                        <>
                            <form onSubmit={handleSubmit(onSubmit)} className={cn("relative flex justify-center", inner_width ? "w-[400px]" : "w-[500px]")}>
                                <Input
                                    type="text"
                                    placeholder="Search ....."
                                    className="rounded-tl-[4] rounded-bl-[4] rounded-tr-none rounded-br-none focus:outline-none focus:ring-0"
                                    {...register("searchTerm")}
                                />
                                {errors.searchTerm && (
                                    <p className="absolute text-red-500 text-xs mt-1 -bottom-5 left-0">
                                        {errors.searchTerm.message}
                                    </p>
                                )}

                                <Select
                                    onValueChange={(value) => setValue("category", value)}
                                    defaultValue={watch("category")}
                                >
                                    <SelectTrigger className="w-[250px] border-t-1 border-b-1 border-r-0 border-l-0 border-gray-200 border-solid rounded-none focus:outline-none focus:ring-0">
                                        <SelectValue placeholder="All category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {productCategories.map((category) => (
                                            <SelectItem key={category.id} value={String(category.id)} onClick={() => handleCategorySelect(category)}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>


                                <Button
                                    type="submit"
                                    className={cn(
                                        "bg-[#0A74FF] hover:bg-[#0c75ffd8] rounded-tr-[4] rounded-br-[4] rounded-tl-none rounded-bl-none focus:outline-none focus:ring-0",
                                        inner_width ? "w-[50px]" : "w-[100px]"
                                    )}
                                >
                                    {inner_width ? <Search className="h-6 w-6 text-white" /> : "Search"}
                                </Button>
                            </form>
                        </>
                    }
                </div>
                <nav className="flex items-center gap-1">
                    <div className=" ">
                        <div className="flex justify-center gap-3 text-[#8B96A5]">
                            <div className="flex flex-col items-center">
                                <UserRound className="h-6 w-6" />
                                <span className="text-xs">Profile</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <MessageSquareMore className="h-6 w-6" />
                                <span className="text-xs">Message</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Heart className="h-6 w-6" />
                                <span className="text-xs">Orders</span>
                            </div>
                            <Link className="flex flex-col items-center" href="/cart" target="_blank">
                                <ShoppingCart className="h-6 w-6" />
                                <span className="text-xs">My cart</span>
                            </Link>
                        </div>
                    </div>
                </nav>
            </nav>
        </>
    );
}


export function DesktopSecondaryHeader() {
    const inner_width = useWindowWidth(1120);
    const langAndCurrency = [
        {
            language: "English", currency: "USD",
        },
        {
            language: "Chinese", currency: "CNY"
        },
        {
            language: "Russian", currency: "RUB"
        },
        {
            language: "Germany", currency: "EURO"
        },
        {
            language: "Britian", currency: "GBP"
        }
    ]
    const flagsImgUrl = [
        { value: "us", name: "USA", img: "/assets/Layout1/Image/flags/US.png" },
        { value: "australia", name: "AUSTRALIA", img: "/assets/Layout1/Image/flags/AUSTRALIA.png" },
        { value: "britian", name: "BRITIAN", img: "/assets/Layout1/Image/flags/BRITIAN.png" },
        { value: "china", name: "CHINA", img: "/assets/Layout1/Image/flags/CHINA.png" },
        { value: "denmark", name: "DENMARK", img: "/assets/Layout1/Image/flags/DENMARK.png" },
        { value: "france", name: "FRANCE", img: "/assets/Layout1/Image/flags/FRANCE.png" },
        { value: "germany", name: "GERMANY", img: "/assets/Layout1/Image/flags/GERMANY.png" },
        { value: "italy", name: "ITALY", img: "/assets/Layout1/Image/flags/ITALY.png" },
        { value: "russia", name: "RUSSIA", img: "/assets/Layout1/Image/flags/RUSSIA.png" },
        { value: "uae", name: "UAE", img: "/assets/Layout1/Image/flags/UAE.png" },
    ];
    return (
        <nav className="h-[60px] flex justify-between items-center text-[#1C1C1C] ">
            <div className="flex justify-between w-[620px]">
                <div className="flex flex-row gap-x-2">
                    <Menu className="h-4 w-4 text-center mt-[4px]" />
                    <span >All Categories</span>
                </div>
                <div className="">
                    <ul className="flex space-x-5">
                        <li>
                            <a href="/products" className="decoration-0 transform-none">Products</a>
                        </li>
                        <li>Hot Offers</li>
                        <li>Gift Boxes </li>
                        <li>Projects</li>
                        <li>Menu Items</li>
                        <li>Help </li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-row space-x-3">
                {
                    inner_width
                        ?
                        null
                        :
                        <>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="English , USD" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Language , Currency</SelectLabel>
                                        {
                                            langAndCurrency.map((cv, i) => (
                                                <SelectItem key={i} value={cv.currency}>{cv.language} , {cv.currency}</SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </>
                }
                <div className="flex flex-row space-x-[8px]">
                    <h1 className="text-gray-500 mt-[7px]">Ship to</h1>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={
                                <span className="flex items-center gap-4">
                                    <img
                                        src="/assets/Layout1/Image/flags/GERMANY.png"
                                        alt="Germany"
                                        className="w-5 h-5"
                                    />
                                    <span>GERMANY</span>
                                </span>
                            } />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Countries</SelectLabel>
                                {
                                    flagsImgUrl.map((cv, i) => (
                                        <SelectItem key={i} value={cv.value}>
                                            <span className="flex items-center gap-4">
                                                <img src={cv.img} alt={cv.name} className="w-5 h-5" />
                                                <span className="">{cv.name}</span>
                                            </span>
                                        </SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </nav>
    )
}
