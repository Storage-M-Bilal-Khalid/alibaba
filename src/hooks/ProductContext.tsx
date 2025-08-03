'use client';

import { ProductGrouped } from '@/components/shared/Dashboard/Seller/data';
import { createContext, useContext, useState, ReactNode } from 'react';

type ProductContextType = {
    product: ProductGrouped[] | null;
    setProduct: (product: ProductGrouped[] | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [product, setProduct] = useState<ProductGrouped[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <ProductContext.Provider value={{ product, setProduct, loading, setLoading }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProduct = (): ProductContextType => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProduct must be used within a ProductProvider');
    }
    return context;
};
