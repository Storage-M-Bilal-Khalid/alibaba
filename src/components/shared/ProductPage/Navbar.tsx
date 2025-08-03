"use client"
import NavForm from "@/components/shared/ProductPage/NavForm";
import { LayoutGrid, Menu } from 'lucide-react';
import { useState } from 'react';

interface ToggleButtonProps {
  currentLayout: 'list' | 'grid'; // Can also use LayoutView from parent if imported
  onLayoutChange: (newLayout: 'list' | 'grid') => void;
}

export function NavbarProductPage({onLayoutChange,currentLayout}:ToggleButtonProps) {
    const handleListClick = () => {
        onLayoutChange('list'); // Call parent with 'list'
    };

    const handleGridClick = () => {
        onLayoutChange('grid'); // Call parent with 'grid'
    };
    return (
        <>
            <nav className='border-1 border-[#dee2ef] bg-white flex justify-between p-2 rounded-[5]'>
                <div className='flex items-center justify-center'>
                    <p className='text-sm tetx-[#1c1c1c]'>12,911 items in Mobile accessory</p>
                </div>
                <div className='flex'>
                    <NavForm />
                    <div className='flex border rounded-[2px] border-[#eff2f4] w-15'>
                        <div
                            className={`pr-[3px] pl-[3px] cursor-pointer ${currentLayout === 'list' ? 'bg-[#eff2f4]' : ''
                                }`}
                            onClick={handleListClick}
                        >
                            <LayoutGrid className='w-6 h-6 text-[#1c1c1c] pt-2' />
                        </div>

                        <div
                            className={`pr-[3px] pl-[3px] overflow-hidden cursor-pointer ${currentLayout === 'grid' ? 'bg-[#eff2f4]' : ''
                                }`}
                            onClick={handleGridClick}
                        >
                            <Menu className='w-6 h-6 text-[#1c1c1c] pt-2' />
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}