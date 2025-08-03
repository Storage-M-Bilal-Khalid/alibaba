"use client";
import Breadcrumbs from "@/components/shared/ProductPage/Breadcrumbs";
import Filters from "@/components/shared/ProductPage/Filters";
import { NavbarProductPage } from "@/components/shared/ProductPage/Navbar";
import { GridView } from '@/components/shared/ProductPage/ProductUIViews/GridView';
import { ListView } from '@/components/shared/ProductPage/ProductUIViews/ListView';
import { useEffect, useState } from 'react';
import { useProduct } from '@/hooks/ProductContext';
import { ProductGrouped } from "../Dashboard/Seller/data";

type LayoutView = 'list' | 'grid';

export interface FormData {
  category: number;
  selectedBrands: number | number[];
  selectedFeatures: number | number[];
  selectedManufacturers: number | number[];
  selectedRatings: number[];
  condition: string;
  minPrice: number;
  maxPrice: number;
}

export default function Products() {
  const { product, loading, setProduct, setLoading } = useProduct();

  const [layoutView, setLayoutView] = useState<LayoutView>('grid');
  const [filters, setFilters] = useState<FormData | null>(null);

  const handleLayoutChange = (newLayout: LayoutView) => {
    setLayoutView(newLayout);
  };

  const handleFilterChange = (newFilters: FormData) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let res;

        if (filters) {
          console.log(`Hit req at api/customers`, filters);
          res = await fetch(`/api/view-products/customers`, {
            method: 'POST',
            body: JSON.stringify(filters)
          });
        } else {
          res = await fetch(`/api/view-products/sellers`, {
            method: 'GET',
          });
        }

        if (!res.ok) {
          console.error(`Failed to fetch products`);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (data && data.result) {
          setProduct(data.result);  // ✅ Update Context Directly
        } else {
          setProduct([]); // If no data, empty context products
        }

        setLoading(false);

      } catch (error) {
        console.error(`Error fetching products`, error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, setProduct, setLoading]);

  return (
    <div className="flex flex-col space-y-4 bg-[#f7fafc]">
      <Breadcrumbs />
      <section className='grid grid-cols-[2fr_8fr] gap-x-5'>
        <div className='flex flex-col'>
          <Filters onFilterChange={handleFilterChange} />
        </div>
        <div>
          <NavbarProductPage onLayoutChange={handleLayoutChange} currentLayout={layoutView} />
          {
            layoutView === 'list'
              ? <ListView />
              : <GridView products={product ?? []} loading={loading} />
          }
        </div>
      </section>
    </div>
  );
}
