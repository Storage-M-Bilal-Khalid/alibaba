"use client"
import { Button } from "@/components/ui/button";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { cn } from "@/lib/utils";
import { CheckCircle, CircleX, Globe, Heart, MessageSquareText, ShieldCheck, ShoppingBasket } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ProductGrouped } from "../Dashboard/Seller/data";
import { useAuth } from "@/hooks/AuthContext";
import { useGuest } from "@/hooks/GuestContext";

interface ProductDisplaySectionProps {
    product: ProductGrouped
}







function manipulateImage(event: React.MouseEvent<HTMLImageElement>): void {
    const imgElementSmall = event.target as HTMLImageElement;
    const newSrcForLargeImage: string = imgElementSmall.src;
    const imgElementLarge = document.getElementById("productDisplayDiv");
    if (imgElementLarge instanceof HTMLImageElement) {
        imgElementLarge.src = newSrcForLargeImage;
    }
}


const details = [
    { label: 'Price', value: 'Negotiable' },
    { label: 'Type', value: 'Classic shoes' },
    { label: 'Material', value: 'Plastic material' },
    { label: 'Design', value: 'Modern nice' },
    { label: 'Customization', value: 'Customized logo and design custom packages' },
    { label: 'Protection', value: 'Refund Policy' },
    { label: 'Warranty', value: '2 years full warranty' },
];

const pricingTiers = [
    {
        price: 98.00,
        currency: '$',
        range: '50-100 pcs',
        // You might add a property for highlighting if needed, e.g., 'isFeatured: true'
        isHighlighted: true // Based on the red color in the image
    },
    {
        price: 90.00,
        currency: '$',
        range: '100-700 pcs',
        isHighlighted: false
    },
    {
        price: 78.00,
        currency: '$',
        range: '700+ pcs',
        isHighlighted: false
    },
];

interface SellerInfoItem {
    id: string;
    icon: React.ElementType | string; // Now stores the Lucide React component
    text: string;
}

const sellerInformation: SellerInfoItem[] = [
    {
        id: 'location',
        icon: "/assets/Layout1/Image/flags/GERMANY.png",
        text: 'Germany, Berlin',
    },
    {
        id: 'verified',
        icon: ShieldCheck,
        text: 'Verified Seller',
    },
    {
        id: 'shipping',
        icon: Globe,
        text: 'Worldwide shipping',
    },
];














export default function ProductDisplaySection({ product }: ProductDisplaySectionProps) {

    const { isAuthenticated, userId, userRole, specificId, loading } = useAuth();

    const { guestId } = useGuest();


    console.log(userId, userRole, specificId, isAuthenticated);

    type AddToFavProps = {
        customerId?: number;
        hybridId?: number;
        productId: number;
    };

    type AddToCartProps = {
        guestId?: string;
        customerId?: number;
        hybridId?: number;
        productId: number;
    }

    async function saveForlater({ customerId, hybridId, productId }: AddToFavProps) {
        if (!productId) {
            console.error("Product ID is required.");
            return;
        }
        try {
            const response = await fetch('/api/save-for-later/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: productId,
                    user: {
                        role: userRole,
                        specificId
                    }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(`❌ API Error: ${errorData.message}`);
                return;
            }

            const result = await response.json();
            console.log(`✅ Success: ${result.message}`);

        } catch (error) {
            console.error('❌ Network or API call failed:', error);
        }
    }


    function handleSaveForLater(productId: number) {
        if (userId && userRole && specificId) {
            if (userRole === 'customer') {
                return saveForlater({ customerId: specificId, productId });
            }
            if (userRole === 'hybrid') {
                return saveForlater({ hybridId: specificId, productId });
            }
        }


        console.warn("No session or guest ID found.");
    }


    async function addToCart({ guestId, customerId, hybridId, productId }: AddToCartProps) {
        if (!productId) {
            console.error("Product ID is required.");
            return;
        }

        // Build URL with correct query param
        let queryParam = '';
        if (customerId) queryParam = `customerId=${customerId}`;
        else if (hybridId) queryParam = `hybridId=${hybridId}`;
        else if (guestId) queryParam = `guestId=${guestId}`;

        const url = `/api/add-to-cart?${queryParam}`;

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ productId }) // Only send productId in body
            });

            if (!res.ok) throw new Error("Failed to add to cart");

            alert("Added to Cart!");
        } catch (error) {
            console.error(error);
            alert("Failed to add item to cart.");
        }
    }



    function handleAddToCart(productId: number) {
        if (userId && userRole && specificId) {
            if (userRole === 'customer') {
                return addToCart({ customerId: specificId, productId });
            }
            if (userRole === 'hybrid') {
                return addToCart({ hybridId: specificId, productId });
            }
        }

        if (guestId) {
            return addToCart({ guestId, productId });
        }

        console.warn("No session or guest ID found.");
    }




    if (loading) {
        return <h1>Loading .......</h1>
    }

    const [isValid, setIsValid] = useState<boolean>(true);


    useEffect(() => {
        if (userRole === 'admin' || userRole === 'owner' || userRole === 'seller') {
            setIsValid(false);
        } else {
            setIsValid(true);
        }
    }, [userRole]);



    return (
        <>
            <section className="grid grid-cols-[1fr_1fr_0.6fr] gap-x-10 border-1 border-[#dee2ef] rounded-[5] p-4 bg-white">
                <div className="grid grid-rows-[8fr_2fr]">
                    <div className=" border-1 border-[#dee2ef] rounded-[5]  cursor-pointer flex justify-center items-center">
                        <img src={product.images[0]} alt="Product image" className="w-100 h-100 object-contain rounded-[5]" id="productDisplayDiv" />
                    </div>
                    <div className="flex justify-start items-start pt-3 space-x-3">
                        {product.images.map((image, index) => (
                            <div
                                key={index}
                                className="border border-[#dee2ef] rounded-[5px]"
                            >
                                <img
                                    src={image}
                                    alt="Product images"
                                    className="w-15 h-15 object-contain rounded-[5px] cursor-pointer p-2"
                                    onClick={manipulateImage}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid grid-rows-[3.5fr_5.5fr]">
                    <div className="flex flex-col space-y-3">
                        <div>
                            {
                                product.stock > 0
                                    ?
                                    <div className="flex space-x-1 text-[#00b517] item-start justify-start">
                                        <CheckCircle className="w-4 h-4 mt-[5px]" />
                                        <p>In stock</p>
                                    </div>
                                    :
                                    <div className="flex space-x-1 text-red-900 item-start justify-start">
                                        <CircleX className="w-4 h-4 mt-[5px]" />
                                        <p>Out of stock</p>
                                    </div>
                            }
                        </div>
                        <div className="min-h-15 h-auto">
                            <h1 className="text-xl font-medium text-[#1c1c1c] ">
                                {product.title}
                            </h1>
                        </div>
                        <ul className="flex space-x-4">
                            <li className="flex space-x-3 text-[#ff9017]">
                                <Rating defaultValue={4}>
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <RatingButton key={index} />
                                    ))}
                                </Rating>
                                <h1 className="font-semibold">3</h1>
                            </li>
                            <li className="flex space-x-1 text-[#787a80]">
                                <MessageSquareText className="w-4 h-4 mt-[5px]" />
                                <h1>134 reviews</h1>
                            </li>
                            <li className="flex space-x-1 text-[#787a80]">
                                <ShoppingBasket className="w-4 h-4 mt-[5px]" />
                                <h1>154 sold</h1>
                            </li>
                        </ul>
                        <div className="flex justify-start items-center bg-[#fff0df] pt-3 pb-3 pr-4 pl-4 rounded-[5]">
                            {
                                pricingTiers.map(
                                    (currentValue, index) => (
                                        <div key={index} className={cn("flex flex-col space-x-3 ", index === 0 ? "pl-0" : "pl-4 border-l-1 border-[#bdc1c8]")}>
                                            <h1 className={cn("font-bold text-2xl", index === 0 ? "text-[#fa3434]" : "text-[#1c1c1c]")}>${currentValue.price}.00</h1>
                                            <p className="text-sm text-[#606060]">{currentValue.range}</p>
                                        </div>
                                    )
                                )
                            }
                        </div>
                    </div>
                    <div className="">
                        {details.map((item, index) => (
                            <div key={item.label} className="py-1">
                                {
                                    index === 0 ?
                                        <div className="flex items-center border-b border-[#e0e0e0] py-3">
                                            <span className="w-32 min-w-[128px] mr-4 text-sm text-[#8b98a5]">{item.label}:</span>
                                            <span className="flex-1 text-sm text-[#505050]">{item.value}</span>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    index === 1 || index === 2 || index === 3 ?
                                        <div className={cn("flex items-center", index === 3 ? "border-b border-[#e0e0e0] pb-3" : null)}>
                                            <span className={cn("w-32 min-w-[128px] mr-4 text-sm text-[#8b98a5]")}>{item.label}:</span>
                                            <span className="flex-1 text-sm text-[#505050]">{item.value}</span>
                                        </div>
                                        :
                                        null
                                }

                                {
                                    index === 4 || index === 5 || index === 6 ?
                                        <div className={cn("flex items-start", index === 6 ? "border-b border-[#e0e0e0] pb-3" : null)}>
                                            <span className={cn("w-32 min-w-[128px] mr-4 text-sm text-[#8b98a5]")}>{item.label}:</span>
                                            <span className="flex-1 text-sm text-[#505050]">{item.value}</span>
                                        </div>
                                        :
                                        null
                                }
                            </div>
                        ))}

                    </div>
                </div>
                <div className="grid grid-rows-[6fr_4fr]">
                    <div className="border-1 border-[#dee2ef] rounded-[5] flex flex-col justify-start items-center">
                        <div className="flex justify-start items-start space-x-2 py-4 px-0 border-b-1 border-[#e0e0e0]">
                            <div className="rounded-[5px] w-10 h-10 text-2xl font-bold bg-[#c6f3f1] text-[#7dc5c4] text-center leading-10">
                                R
                            </div>
                            <div className="pl-3">
                                <h1 className="text-[#1c1c1c] text-sm">Supplier</h1>
                                <p className="text-[#1c1c1c]">Guanjoi Trading LLC</p>
                            </div>
                        </div>
                        <div>
                            {sellerInformation.map((item, index) => (
                                <div key={item.id} className="flex items-center justify-start pt-5 space-x-7">
                                    {
                                        index === 0
                                            ?
                                            <img src={item.icon as string} alt="Flag image" className="w-5 h-5 object-contain" />
                                            :
                                            <item.icon className={cn("w-5 h-5 ", index == 1 ? "text-[#00b517]" : "text-[#8b96a5]")} />
                                    }

                                    <span className={cn(index === 1 ? "text-green-400" : "text-[#8b96a5]")}>{item.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col w-full p-7 space-y-4 ">
                            <Button className="p-2 rounded-[5] bg-[#0A74FF] text-white border-1 border-[#0A74FF] hover:tracking-wide transition-all duration-300 ease-in-out  hover:cursor-pointer" variant="default" onClick={() => handleAddToCart(product.product_id)} disabled={!isValid}>
                                {
                                    !isValid
                                        ?
                                        `${userRole?.charAt(0).toUpperCase()}${userRole?.slice(1)} can't add to cart`
                                        :
                                        "Add to cart"
                                }
                            </Button>
                            <Button className=" p-2 rounded-[5] text-[#0A74FF] bg-white border-1 border-[#e0e0e0] hover:tracking-wide transition-all duration-300 ease-in-out   hover:cursor-pointer" variant="default">Seller's profile</Button>
                        </div>
                    </div>
                    <div className="flex items-start justify-center mt-5">
                        <Button variant="link" className="p-2 rounded-none text-[#505050] hover:border-b-[#505050] hover:border-b-1 hover:tracking-wide transition-all duration-300 ease-in-out  hover:cursor-pointer" onClick={() => { handleSaveForLater(product.product_id) }} disabled={!isValid}>
                            {
                                !isValid
                                    ?
                                    <>

                                        <Heart className="w-4 h-4 text-[#0A74FF]" />
                                        <h1 className="text-sm">{userRole?.charAt(0).toUpperCase()}{userRole?.slice(1)} can't add to favourites</h1>
                                    </>
                                    :
                                    <>
                                        <Heart className="w-4 h-4 text-[#0A74FF]" />
                                        <h1 className="text-sm">Save for later</h1>
                                    </>
                            }
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}