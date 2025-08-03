"use client"
import { ProductGrouped } from "@/components/shared/Dashboard/Seller/data";
import ProductDetail from "@/components/shared/ProductDetail";
import React, { useEffect, useState } from "react";

export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
    const resolvedParams = React.use(params);
    const { productId } = resolvedParams;

    const [product, setProduct] = useState<ProductGrouped | null>(null);
        const [productLoad, setProductLoad] = useState(true)
        useEffect(() => {
          const viewproducts = async () => {
            try {
              setProductLoad(true);
              const res = await fetch(`/api/view-products/sellers?productId=${productId}`, {
                method: 'GET',
              });
      
              if (!res.ok) {
                console.log(`Error`)
                return;
              }
              const data = await res.json();
              if (data && data.result) {
                setProduct(data.result[0]);
                setProductLoad(false);
                console.log('Fetched Products:', data.result);
              } else {
                console.log(`Error`)
              }
            } catch (err: any) {
              console.log(`Error`)
            }
          };
          viewproducts();
        }, []);

    if (!product) {
        return <div>Product not found.</div>;
    }

    return (
        <ProductDetail product={product}/>
    );
}







