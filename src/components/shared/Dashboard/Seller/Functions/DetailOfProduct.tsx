"use client";
import { Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface DetailOfProductDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function DetailOfProduct() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <div className="p-2 rounded-[5px] border border-[#dee2ef]"  onClick={handleOpen}>
                  <Info className="w-4 h-4  text-[#0d6efd] cursor-pointer hover:text-green-500 "/>
                </div>
            <DetailOfProductDialog open={open} onClose={handleClose} />
        </>
    );
}


function DetailOfProductDialog({ open, onClose }: DetailOfProductDialogProps) {
    const [show, setShow] = useState(false);

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
          relative w-[60vw] h-[90vh] bg-white rounded-xl shadow-xl p-6
          transform transition-all duration-300
          ${open ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className={cn("bg-[#117dff] rounded-full w-8 h-8 absolute flex items-center justify-center top-5 right-5")}
                    onClick={onClose}
                >
                    <X className="w-5 h-5 text-white" />
                </button>
                <h2 className="text-xl font-semibold mb-4">Detail of Product</h2>
                <p className="text-gray-600">Put your form or content here.</p>
            </div>
        </div>
    );
}