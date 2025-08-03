"use client"
import SaveForLaterProducts from "@/components/shared/Cart/SaveForLater";
import DiscountBanner from "@/components/shared/ProductDetail/DiscountBanner";
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
} from "@/components/ui/select"
import { useAuth } from "@/hooks/AuthContext";
import { useGuest } from "@/hooks/GuestContext";
import { ArrowLeft, LockKeyhole, MessageSquareText, Truck } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { errorNotifier, successNotifier } from "@/lib/designPatterns/notificationTrigger";
import { cn } from "@/lib/utils";

interface CartItem {
    item_id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    title: string;
    description: string;
    tierone_price: number;
    tiertwo_price: number;
    tierthree_price: number;
    stripe_product_id: string;
    stripe_price_id: string;
    stripe_account_id: string;
    email: string;
    seller: string;
    img: string;
}

export default function Cart() {
    const { userRole, specificId } = useAuth();
    const { guestId } = useGuest();
    const router = useRouter();

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isConfirmed, setIsConfirmed] = useState<{ [key: number]: boolean }>({});

    const { register, handleSubmit } = useForm();

    // Memoize the fetch function to avoid re-creating it
    const fetchCartData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            let url = '/api/cart?';
            if (userRole === 'customer' && specificId) {
                url += `customerId=${specificId}`;
            } else if (userRole === 'hybrid' && specificId) {
                url += `hybridId=${specificId}`;
            } else if (guestId) {
                url += `guestId=${guestId}`;
            } else {
                console.warn('No valid user or guest ID found.');
                setLoading(false);
                return;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch cart data');
            }
            const data = await response.json();

            if (data.success && data.cartItems) {
                setCartItems(data.cartItems);
                // Initialize all items as confirmed on load
                const initialConfirmations: { [key: number]: boolean } = {};
                data.cartItems.forEach((item: CartItem) => {
                    initialConfirmations[item.item_id] = true;
                });
                setIsConfirmed(initialConfirmations);
            } else {
                setError(data.message || 'Failed to load cart');
            }
        } catch (err: any) {
            console.error('Fetch Cart Data Error:', err);
            setError(err.message || 'Unexpected error');
        } finally {
            setLoading(false);
        }
    }, [userRole, specificId, guestId]);

    useEffect(() => {
        fetchCartData();
    }, [fetchCartData]);

    const updateCartInDatabase = async (itemId: number, newQuantity: number) => {
        try {
            const response = await fetch('/api/cart/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId,
                    newQuantity,
                    user: {
                        role: userRole,
                        specificId
                    },
                    guestId: guestId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update cart item in the database.');
            }

            toast.success('Cart updated successfully!');
            return true;
        } catch (err) {
            console.error('Error updating cart:', err);
            toast.error('Failed to update cart.');
            return false;
        }
    };

    const handleConfirmQuantity = async (index: number) => {
        const itemToUpdate = cartItems[index];
        if (!itemToUpdate) return;

        if (itemToUpdate.quantity === 100) {
            setIsConfirmed(prev => ({ ...prev, [itemToUpdate.item_id]: true }));
            return;
        }

        const success = await updateCartInDatabase(itemToUpdate.item_id, itemToUpdate.quantity);
        if (success) {
            setIsConfirmed(prev => ({ ...prev, [itemToUpdate.item_id]: true }));
        }
    };

    const handleQuantityChange = (index: number, newQty: string) => {
        const newQuantityNumber = Number(newQty);
        const itemToUpdate = cartItems[index];

        if (itemToUpdate) {
            setCartItems(prevItems => {
                const updatedItems = [...prevItems];
                updatedItems[index] = { ...updatedItems[index], quantity: newQuantityNumber };
                return updatedItems;
            });

            setIsConfirmed(prev => ({ ...prev, [itemToUpdate.item_id]: false }));
        }
    };

    // New function to handle removing a single item
    const handleRemoveItem = async (itemId: number) => {

        try {
            const response = await fetch('/api/cart/remove', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId,
                    user: {
                        role: userRole,
                        specificId
                    },
                    guestId: guestId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to remove item from cart.');
            }

            successNotifier.notify("Item removed from cart successfully!");
            // Re-fetch cart data to update the UI
            fetchCartData();
        } catch (error: any) {
            console.error('Error removing item:', error);
            errorNotifier.notify(error.message || "Failed to remove item.");
        }
        alert(itemId)

    };

    // New function to handle removing all items
    const handleRemoveAll = async () => {
        alert('Remove all')
        try {
            const response = await fetch('/api/cart/empty', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: {
                        role: userRole,
                        specificId
                    },
                    guestId: guestId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to empty cart.');
            }

            successNotifier.notify("Cart emptied successfully!");
            // Clear cart items in state
            setCartItems([]);
            setIsConfirmed({});
        } catch (error: any) {
            console.error('Error emptying cart:', error);
            errorNotifier.notify(error.message || "Failed to empty cart.");
        }
        alert("Remove all")
    };

    const totalCartPrice = cartItems.reduce((acc, item) => {
        const quantity = item.quantity;
        let pricePerPiece = item.tierone_price;

        if (quantity === 500) {
            pricePerPiece = item.tiertwo_price;
        } else if (quantity === 1500) {
            pricePerPiece = item.tierthree_price;
        }

        return acc + quantity * pricePerPiece;
    }, 0);

    const discount = totalCartPrice * 0.1;
    const tax = totalCartPrice * 0.02;
    const totalBeforeTax = totalCartPrice - discount;
    const finalTotal = totalBeforeTax + tax;

    const onSubmit = (data: any) => {
        console.log("Coupon applied:", data.coupon);
        alert(`Coupon "${data.coupon}" applied!`);
    };

    const cardsSrc: string[] = [
        "/cards/americanExpress.png",
        "/cards/masterCard.png",
        "/cards/paypal.png",
        "/cards/visa.png",
        "/cards/applePay.png",
    ];

    const isCheckoutEnabled = cartItems.every(item => isConfirmed[item.item_id]);

    const goToCheckOut = async () => {
        alert(JSON.stringify(cartItems))
        if (cartItems.length === 0) {
            errorNotifier.notify("Your cart is empty.")
            return;
        }

        try {
            console.log(`From handleCheckout button : ${cartItems}`)
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cartItems, user: { role: userRole, specificId } }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                successNotifier.notify(errorData?.error || 'Failed to initiate checkout.')
                return;
            }

            const data = await response.json();

            if (data?.url) {
                router.push(data.url);
            } else if (data?.urls && Array.isArray(data.urls) && data.urls.length > 0) {
                const redirectToCheckout = async (urls: string[]) => {
                    if (urls.length > 0) {
                        router.push(urls[0]);
                        urls.forEach(url => window.open(url, '_blank'));
                        errorNotifier.notify('You will be redirected to separate checkout pages for each seller.');
                    }
                };
                redirectToCheckout(data.urls);
            } else {
                errorNotifier.notify('Invalid checkout response received.')
            }
        } catch (error: any) {
            errorNotifier.notify(`Error initiating checkout: ${error.message}`)
        }
    };



    return (
        <div className="flex flex-col space-y-8 py-2">
            <section className="flex flex-col space-y-5 mt-5">
                <h1 className="text-2xl font-medium text-[#1c1c1c]">My cart ({cartItems.length})</h1>
                <div className="grid grid-cols-[8fr_2fr] gap-x-5 mt-2">
                    <div className={cn("bg-white border-1 border-[#dee2e7] rounded-[5] p-4 min-h-10 h-auto", cartItems.length === 0 ? "flex justify-center items-center" : null)}>
                        {
                            loading ? (
                                // Render this block when the cart is loading
                                <div className="flex justify-center items-center h-48">
                                    <h1 className="text-center text-2xl font-bold text-gray-500">Loading...</h1>
                                </div>
                            ) : cartItems.length === 0 ? (
                                // Render this block when the cart is empty
                                <div className="flex flex-col justify-center items-center space-y-5">
                                    <img src="/hippo-empty-cart-removebg-preview.png" alt="" className="w-60 h-60" />
                                    <h1 className="text-center text-xl font-light text-[$505050]">Cart is Empty</h1>
                                    <Button className="py-2 w-40 rounded-[5] text-white bg-[#0A74FF] border-1 border-[#DEE2E7] hover:tracking-wide transition-all duration-300 ease-in-out  hover:cursor-pointer" variant="default" onClick={() => router.push('/')}>
                                        <ArrowLeft className="w-4 h-4 text-white" />
                                        Go to Shop
                                    </Button>
                                </div>
                            ) : (
                                // Render this block when the cart has items
                                <>
                                    {
                                        cartItems.map((currentValue, index) => (
                                            <MapProductInCartSec
                                                key={currentValue.item_id}
                                                currentValue={currentValue}
                                                onQuantityChange={(newQty) => handleQuantityChange(index, newQty)}
                                                onConfirmQuantity={() => handleConfirmQuantity(index)}
                                                onRemoveItem={() => handleRemoveItem(currentValue.item_id)}
                                                isConfirmed={isConfirmed[currentValue.item_id]}
                                            />
                                        ))
                                    }
                                    <div className="flex mt-3 justify-between">
                                        <Button className="py-2 w-40 rounded-[5] text-white bg-[#0A74FF] border-1 border-[#DEE2E7] hover:tracking-wide transition-all duration-300 ease-in-out  hover:cursor-pointer" variant="default" onClick={() => router.push('/')}>
                                            <ArrowLeft className="w-4 h-4 text-white" />
                                            Back to Shop
                                        </Button>
                                        <Button
                                            className="py-2 w-40 rounded-[5] bg-white text-red-500 border-1 border-[#DEE2E7] hover:tracking-wide transition-all duration-300 ease-in-out  hover:cursor-pointer"
                                            variant="default"
                                            onClick={handleRemoveAll}
                                        >
                                            Remove All
                                        </Button>
                                    </div>
                                </>
                            )
                        }
                    </div>
                    <div className="flex flex-col space-y-5">
                        <div className="border-1 border-[#dee2ef] rounded-[5] bg-white py-4 px-3">
                            <p className="text-[#505050] text-sm">Have a coupon ?</p>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex rounded-[5] overflow-hidden border border-[#dee2ef] mt-3">
                                <Input
                                    type="text"
                                    placeholder="Add coupon"
                                    className="flex-grow rounded-tr-none rounded-br-none rounded-tl-[5] rounded-bl-[5] border-0 border-r-1 border-[#dee2ef]"
                                    {...register("coupon", { required: "Coupon code is required" })}
                                />
                                <Button
                                    type="submit"
                                    className="bg-white text-[#0A74FF] rounded-l-none hover:underline hover:tracking-wide transition-all duration-300 ease-in-out w-18 cursor-pointer font-medium"
                                >
                                    Apply
                                </Button>
                            </form>
                        </div>
                        <div className="border-1 border-[#dee2ef] rounded-[5] bg-white py-4 px-3">
                            <div className="pb-3 border-b border-[#dee2ef]">
                                <ul className="flex flex-col space-y-2  text-[#505050]">
                                    <li className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>${totalCartPrice.toFixed(2)}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Discount:</span>
                                        <span className="text-[#fa3434]">-${discount.toFixed(2)}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Tax:</span>
                                        <span className="text-[#00b517]">+${tax.toFixed(2)}</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex flex-col">
                                <ul className="flex flex-col space-y-2  text-[#505050]">
                                    <li className="flex justify-between text-[#505050] my-3 font-bold tracking-wider text-xl">
                                        <span>Payable:</span>
                                        <span>${finalTotal.toFixed(2)}</span>
                                    </li>
                                </ul>
                                <Button
                                    className="mt-2 py-2 w-full rounded-[5] text-white bg-[#00b517] hover:tracking-wide transition-all duration-300 ease-in-out"
                                    variant="default"
                                    onClick={goToCheckOut}
                                    disabled={!isCheckoutEnabled || cartItems.length === 0}
                                >
                                    Checkout
                                </Button>
                                <ul className="flex flex-row justify-evenly items-center mt-3">
                                    {
                                        cardsSrc.map(
                                            (cv, i) => (
                                                <li key={i}>
                                                    <img src={cv} alt="card img" className="w-7 h-5" />
                                                </li>
                                            )
                                        )
                                    }
                                </ul>
                            </div>
                            <div></div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-[8fr_2fr] gap-x-5 mt-2">
                    <ul className="flex justify-between">
                        <li className="flex justify-start items-center  space-x-4">
                            <div className="w-10 h-10 rounded-full bg-[#dee2ef]  flex items-center justify-center">
                                <LockKeyhole className="w-4 h-4 text-[#8b96a5]" />
                            </div>
                            <div className="text-sm">
                                <p className="text-[#1c1c1c]">Secure payment</p>
                                <p className="text-[#8b96a5]">Have you ever finally just </p>
                            </div>
                        </li>
                        <li className="flex justify-start items-center  space-x-4">
                            <div className="w-10 h-10 rounded-full bg-[#dee2ef]  flex items-center justify-center">
                                <MessageSquareText className="w-4 h-4 text-[#8b96a5]" />
                            </div>
                            <div className="text-sm">
                                <p className="text-[#1c1c1c]">Customer support</p>
                                <p className="text-[#8b96a5]">Have you ever finally just </p>
                            </div>
                        </li>
                        <li className="flex justify-start items-center  space-x-4">
                            <div className="w-10 h-10 rounded-full bg-[#dee2ef]  flex items-center justify-center">
                                <Truck className="w-4 h-4 text-[#8b96a5]" />
                            </div>
                            <div className="text-sm">
                                <p className="text-[#1c1c1c]">Free delivery</p>
                                <p className="text-[#8b96a5]">Have you ever finally just </p>
                            </div>
                        </li>
                    </ul>
                    <div></div>
                </div>
            </section>
            <SaveForLaterProducts fetchCartData={fetchCartData}/>
            <DiscountBanner
                title="Super discount on more than 100 USD"
                description="Have you ever finally just write dummy info"
                buttonText="Shop now"
            />
        </div>
    )
}

interface MapProductInCartSecProps {
    currentValue: CartItem;
    onQuantityChange: (newQty: string) => void;
    onConfirmQuantity: () => void;
    onRemoveItem: () => void; // New prop for single item removal
    isConfirmed: boolean;
}

function MapProductInCartSec({ currentValue, onQuantityChange, onConfirmQuantity, onRemoveItem, isConfirmed }: MapProductInCartSecProps) {
    const selectedQuantity = Number(currentValue.quantity);
    let pricePerPiece: number;

    if (selectedQuantity === 500) {
        pricePerPiece = currentValue.tiertwo_price;
    } else if (selectedQuantity === 1500) {
        pricePerPiece = currentValue.tierthree_price;
    } else {
        pricePerPiece = currentValue.tierone_price;
    }

    // Ensure totalPerProduct is a number before using toFixed
    const totalPerProduct = !isNaN(selectedQuantity) ? selectedQuantity * pricePerPiece : 0;

    return (
        <div className="flex flex-row justify-between items-start space-y-2 border-b-1 border-[#e0e0e0] py-3">
            <div className="flex flex-row items-start justify-start space-x-5">
                <div className="border-1 border-[#e0e0e0] bg-amber-300 rounded-[5]">
                    <img src={currentValue.img} alt="Product image" className="w-20 h-20 rounded-[5]" />
                </div>
                <div className="">
                    <h1 className="text-[#1c1c1c]">{currentValue.title}</h1>
                    <p className="flex space-x-5 text-sm text-[#8b96a5]">
                        {currentValue.description}
                    </p>
                    <ul className="flex space-x-5 text-sm text-[#8b96a5]">
                        <li>
                            Seller : {currentValue.seller}
                        </li>
                    </ul>
                    <div className="flex space-x-5 mt-3 font-medium">
                        <Button
                            className="py-2 w-25 rounded-[5] bg-white text-red-500 border-1 border-[#DEE2E7] hover:tracking-wide transition-all duration-300 ease-in-out  hover:cursor-pointer"
                            variant="default"
                            onClick={onRemoveItem}
                        >
                            Remove
                        </Button>
                        <Button className="py-2 w-30 rounded-[5] text-[#0A74FF] bg-white border-1 border-[#DEE2E7] hover:tracking-wide transition-all duration-300 ease-in-out   hover:cursor-pointer" variant="default">Save for later</Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
                <h1 className="text-[#1c1c1c]">
                    Price per Piece : ${pricePerPiece}
                </h1>
                <h1 className="text-[#1c1c1c] font-medium">
                    ${pricePerPiece} x {selectedQuantity} = ${totalPerProduct.toFixed(2)}
                </h1>
                <QuantitySelection
                    onQuantityChange={onQuantityChange}
                    onConfirmQuantity={onConfirmQuantity}
                    sellerName={currentValue.seller}
                    initialQuantity={currentValue.quantity.toString()}
                    isConfirmed={isConfirmed}
                />
            </div>
        </div>
    )
}

const quantityOptions = ["100", "500", "1500"];

interface QuantitySelectionProps {
    onQuantityChange: (selectedQty: string) => void;
    onConfirmQuantity: () => void;
    sellerName: string;
    initialQuantity: string;
    isConfirmed: boolean;
}

function QuantitySelection({ onQuantityChange, onConfirmQuantity, sellerName, initialQuantity, isConfirmed }: QuantitySelectionProps) {
    const handleValueChange = (newValue: string) => {
        onQuantityChange(newValue);
    };

    return (
        <div className="flex flex-col space-y-2 items-end">
            <Select value={initialQuantity} onValueChange={handleValueChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={`Qty : ${initialQuantity} pieces`} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Quantity from {sellerName}</SelectLabel>
                        {
                            quantityOptions.map(
                                (q, index) => (
                                    <SelectItem value={q} key={index}>
                                        {`Qty : ${q} pieces`}
                                    </SelectItem>
                                )
                            )
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Button
                className="py-2 w-40 rounded-[5] text-white bg-[#0A74FF] hover:bg-[#0A74FF]/90 transition-all duration-300 ease-in-out"
                onClick={onConfirmQuantity}
                disabled={isConfirmed}
            >
                Confirm Quantity
            </Button>
        </div>
    );
}
