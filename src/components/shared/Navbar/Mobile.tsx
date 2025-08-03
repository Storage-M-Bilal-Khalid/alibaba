"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingCart, UserRound } from "lucide-react";

import { Icons } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";


export default function MobileHeader() {

    const inner_width = useWindowWidth(1030);

    return (
        <header className="flex flex-col space-y-1 bg-white">
            <div className="flex justify-between pt-4 pb-2 ">
                <div className="flex gap-x-3">
                    <div>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Menu className="h-6 w-6 text-gray-600 mt-[5px]" />
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetTitle>Nav Items</SheetTitle>
                            </SheetContent>
                        </Sheet>
                    </div>
                    <div className="flex items-center gap-x-4">
                        <Icons.logo className='h-10 w-10' />
                    </div>
                </div>
                <div className="flex text-gray-600 gap-x-3 mt-2">
                    <div >
                        <Sheet>
                            <SheetTrigger asChild>
                                <ShoppingCart className="h-5 w-5" />
                            </SheetTrigger>
                            <SheetContent side="right">
                                <SheetTitle>My Cart</SheetTitle>
                            </SheetContent>
                        </Sheet>
                    </div>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <UserRound className="h-5 w-5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Billing</DropdownMenuItem>
                                <DropdownMenuItem>Team</DropdownMenuItem>
                                <DropdownMenuItem>Subscription</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {/* Search bar */}
            <div>
                <div className="flex items-center">
                    <div className={cn("relative flex justify-center w-full")}>
                        <Input
                            type="text"
                            placeholder="Search ....."
                            className="rounded-tl-lg rounded-bl-lg rounded-tr-none rounded-br-none focus:outline-none focus:ring-0"
                        />
                        <Button className={
                            cn(
                                "bg-[#0c75ffd2] hover:bg-[#0C77FF] rounded-tr-lg rounded-br-lg rounded-tl-none rounded-bl-none focus:outline-none focus:ring-0",
                                inner_width ? "w-[50px]" : "w-[100px]"
                            )
                        }>
                            {
                                inner_width ? <Search className="h-6 w-6 text-white" /> : "Search"
                            }
                        </Button>
                    </div>
                </div>
            </div>
            <div>
                <CategorySlider />
            </div>
        </header>
    );
}


const categories = [
    "All category",
    "Gadgets",
    "Clothes",
    "Accessories",
    "Shoes",
    "Beauty",
    "Toys",
    "Books",
    "Electronics",
    "Home",
    "Sports",
    "More",
];

function CategorySlider() {
    return (
        <div className="w-full bg-white">
            <div
                className="flex overflow-x-auto no-scrollbar gap-2 py-2 px-1"
                tabIndex={0}
                aria-label="Category slider"
            >
                {categories.map((currentValue, index) => (
                    <button
                        key={index}
                        className={cn(
                            "whitespace-nowrap px-4 py-2 rounded-md border border-gray-200 bg-gray-50 text-blue-500 font-medium transition-colors",
                            index === 0 && "bg-blue-50 border-blue-200" // Highlight first
                        )}
                    >
                        {currentValue}
                    </button>
                ))}
            </div>
        </div>
    );
}