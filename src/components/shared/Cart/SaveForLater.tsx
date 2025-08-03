"use client"
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/AuthContext";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useGuest } from "@/hooks/GuestContext";

export type SavedForLaterProduct = {
    product_id: number;
    title: string;
    description: string;
    tierone_price: string;
    stock: number;
    image_url: string;
};

interface SaveForLaterProductsProps {
    fetchCartData: () => void; // A function that re-fetches cart data
}

export default function SaveForLaterProducts({ fetchCartData }: SaveForLaterProductsProps) {
    const { isAuthenticated, specificId, userRole, userId } = useAuth();
    const { guestId } = useGuest()

    const [savedProducts, setSavedProducts] = useState<SavedForLaterProduct[]>([]);
    const [listId, setListId] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true);

    const fetchSavedProducts = async () => {
        if (!isAuthenticated || !userRole || !specificId) {
            setIsLoading(false);
            setSavedProducts([]); // Clear products if not authenticated
            return;
        }

        setIsLoading(true);
        try {
            // Construct the API URL with user information as query parameters
            const apiUrl = `/api/save-for-later/view-save-products?userRole=${userRole}&specificId=${specificId}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('Failed to fetch saved products');
            }

            const data = await response.json();
            if (data.status === 200) {
                setListId(data.listId);
                setSavedProducts(data.savedForLaterProducts);
            }
        } catch (error) {
            console.error("Error fetching saved products:", error);
            setSavedProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedProducts();
    }, [isAuthenticated, userRole, specificId]);

    type MoveToCartProps = {
        guestId?: string;
        customerId?: number;
        hybridId?: number;
        productId: number;
    }

    const moveToCart = async ({ productId, guestId, hybridId, customerId }: MoveToCartProps) => {
        if (!productId) {
            console.error("Product ID is required.");
            return;
        }

        console.log(`List if from move cart : ${listId}`)
        
        // Optimistically remove the product from the UI
        const previousSavedProducts = savedProducts;
        const updatedSavedProducts = savedProducts.filter(p => p.product_id !== productId);
        setSavedProducts(updatedSavedProducts);
        
        // Determine the query parameters for the API call
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
                body: JSON.stringify({ productId, shouldRemoveFromSaveForLater: true, listId })
            });

            if (!res.ok) {
                // If API call fails, revert the state to the previous products list
                setSavedProducts(previousSavedProducts);
                throw new Error("Failed to add to cart");
            }

            // Call the prop function to refresh the cart
            fetchCartData();

            // Note: We don't call fetchSavedProducts() here because we already updated the state
            // and the API is designed to delete the item. The next time the component mounts or
            // the dependencies change, the list will be fetched correctly.
        } catch (error) {
            console.error(error);
        }
    };

    function handleMoveToCart(productId: number) {
        if (userId && userRole && specificId) {
            if (userRole === 'customer') {
                return moveToCart({ customerId: specificId, productId });
            }
            if (userRole === 'hybrid') {
                return moveToCart({ hybridId: specificId, productId });
            }
        }
        console.warn("No session or guest ID found.");
    }

    return (
        <section className="border-1 border-[#dee2e7] bg-white pt-4 pb-0 px-4 rounded-[5] grid grid-rows-[0.5fr_3fr] gap-y-5">
            <p className="text-[#1c1c1c] p-0 m-0 font-semibold">Saved for later</p>
            <div className="flex justify-start items-center space-x-6">
                {isLoading ? (
                    <div className="w-full text-center py-10">
                        <p>Loading saved products...</p>
                    </div>
                ) : savedProducts.length === 0 ? (
                    <div className="w-full text-center py-10">
                        <p>No products saved for later.</p>
                    </div>
                ) : (
                    savedProducts.map((cv, index) => (
                        <div className="grid grid-rows-[2fr_0.7fr] gap-x-10" key={index}>
                            <div className="flex justify-center items-center border-1 border-[#eeeeee] rounded-[5] cursor-pointer">
                                <img src={cv.image_url} alt="Product image" className="w-65 h-65 rounded-[5]" />
                            </div>
                            <div className="flex flex-col space-y-1 pt-2">
                                <p className="text-[#505050] font-medium text-xl">${cv.tierone_price}</p>
                                <p className="text-[#8b96a5] cursor-pointer hover:underline hover:text-[#0d6efd] transition-all duration-150 ease-in-out">{cv.title}</p>
                                <p className="text-[#8b96a5] text-sm cursor-pointer transition-all duration-150 ease-in-out">
                                    {cv.description.length > 40 ? `${cv.description.slice(0, 40)}...` : cv.description}
                                </p>
                                <Button
                                    className="py-2 w-40 rounded-[5] text-[#0A74FF] bg-white border-1 border-[#DEE2E7] hover:tracking-wide transition-all duration-300 ease-in-out hover:cursor-pointer"
                                    variant="default"
                                    onClick={() => { handleMoveToCart(cv.product_id) }}
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Move to cart
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
