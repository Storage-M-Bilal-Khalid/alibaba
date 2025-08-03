"use client";


// 📌 Summary for Form Design
// You can group the seller form into these steps or sections:

// Basic Info – title, description, category, condition, stock, price

// Images Upload – upload 3 to 6 images

// Quantity Pricing – add tiers (optional)

// Metadata Tags – select brands, features, manufacturers (optional)

import { Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function UpdateProduct() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <div className="p-2 rounded-[5px] border border-[#dee2ef]" onClick={handleOpen}>
                <Pencil className="w-4 h-4  text-[#0d6efd] cursor-pointer hover:text-gray-500 " />
            </div>
            <UpdateProductDialog open={open} onClose={handleClose} />
        </>
    );
}



interface UpdateProductDialogProps {
    open: boolean;
    onClose: () => void;
}

function UpdateProductDialog({ open, onClose }: UpdateProductDialogProps) {
    const [show, setShow] = useState(false);

    // Delay for smooth closing
    useEffect(() => {
        if (open) setShow(true);
        else {
            const timeout = setTimeout(() => setShow(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [open]);

    if (!open && !show) return null;

    return (
        <div
            className={`
        fixed inset-0 z-50 flex items-center justify-center
        ${open ? "bg-black/30 backdrop-blur-sm" : "bg-black/0"}
        transition-all duration-300
      `}
            onClick={onClose}
        >
            <div
                className={`
          relative w-[80vw] h-[80vh] bg-white rounded-xl shadow-xl p-6
          transform transition-all duration-300
          ${open ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    className={cn("bg-[#117dff] rounded-full w-8 h-8 absolute flex items-center justify-center top-5 right-5")}
                    onClick={onClose}
                >
                    <X className="w-5 h-5 text-white" />
                </button>

                {/* Content */}
                <h2 className="text-xl font-semibold mb-4">Update Product</h2>
                <p className="text-gray-600">Put your form or content here.</p>
            </div>
        </div>
    );
}



