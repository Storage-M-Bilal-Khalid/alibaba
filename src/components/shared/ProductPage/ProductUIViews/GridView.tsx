"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { cn } from "@/lib/utils";
import { BookMarked, BookmarkIcon, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useMemo, useState } from 'react';
import { ALL_PRODUCTS, Product } from '../configuration/configuration';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductGrouped } from "../../Dashboard/Seller/data";
import { useAuth } from "@/hooks/AuthContext";
import { IconBookmarkAi } from "@tabler/icons-react";
import { useProduct } from '@/hooks/ProductContext';


function sliceArrayIntoChunks<T>(arr: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}

interface GridViewProductDisplayProps {
  loading: boolean;
  product: ProductGrouped;
}

function GridViewProductDisplay({ loading, product }: GridViewProductDisplayProps) {

  const { isAuthenticated, userId, userRole, specificId } = useAuth();

  async function saveForLater(product_id:number) {
    console.log(`Attempting to save product ${product_id} for user ${specificId} and role is ${userRole}...`);

    try {
      const response = await fetch('/api/save-for-later/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product_id,
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

  return (
    <div className='border-1 bg-white border-[#dee2ef] grid grid-rows-[7fr_3fr] p-3 rounded-[5] w-[330px] h-[330px]'>
      <div className='border-b-1 border-[#eff2f4] flex items-center justify-center'>
        {/* Use the first image from the product.images array */}
        <img src={product.images?.[0] || 'placeholder.png'} alt="Product" className='w-50 h-50 object-contain' />
      </div>
      <div className=' grid grid-cols-[8.5fr_1.5fr] pt-3'>
        <div>
          <h1 className="text-[#1c1c1c] text-sm font-medium">
            {/* Display the price from the product object */}
            ${product.price} <del className="text-[#8b96a5] font-normal text-sm ml-1">${product.price}</del>
          </h1>
          <ol className="flex space-x-3">
            <li>
              <Rating defaultValue={3}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <RatingButton className="text-[#ff9017]" key={idx} />
                ))}
              </Rating>
            </li>
            <li className="text-[#ff9017]">
              {/* Display the rating from the product object */}
              3
            </li>
          </ol>
          <h2 className="text-[#606060] text-sm">
            {/* Display the product title */}
            {product.title}
          </h2>
          <Button variant="link" className="underline text-[#0d6efd] cursor-pointer pl-[0]">
            <Link href={`/productDetail/${product.product_id}`} target='_blank'>View Details</Link>
          </Button>
        </div>
        <Button className="w-auto h-8 p-2 rounded-[5px] border border-[#dee2ef] flex items-center justify-center bg-white" disabled={!isAuthenticated || userRole === 'seller' || userRole === 'admin' || userRole === 'owner'} onClick={()=>saveForLater(product.product_id)} title={!isAuthenticated ? "Guest can't add to Save to later" : "Save to Later"}>
          <BookmarkIcon className="w-5 h-5 text-[#0d6efd] cursor-pointer hover:text-red-500 hover:fill-red-200" />
        </Button>
      </div>
    </div>
  );
}

export const GridView = ({ loading, products }: { loading: boolean; products: ProductGrouped[] }) => {

  // Your existing logic to chunk the products
  const productsPerRow = 3; // Or a value from a state variable if you want to make it dynamic
  const slicedProducts = sliceArrayIntoChunks(products, productsPerRow);

  const [itemsPerPage, setItemsPerPage] = useState<number>(3);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageGroup, setCurrentPageGroup] = useState<number>(0);

  const totalPages: number = Math.ceil(slicedProducts.length / itemsPerPage);

  const startIndex: number = (currentPage - 1) * itemsPerPage;
  const endIndex: number = startIndex + itemsPerPage;
  const currentProductsToDisplay: ProductGrouped[][] = slicedProducts.slice(startIndex, endIndex);

  const handleShowSelectChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
    setCurrentPageGroup(0);
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousGroup = () => {
    setCurrentPageGroup(prevGroup => {
      const newGroup = Math.max(0, prevGroup - 1);
      setCurrentPage(newGroup * 3 + 1);
      return newGroup;
    });
  };
  const handleNextGroup = () => {
    setCurrentPageGroup(prevGroup => {
      const newGroup = prevGroup + 1;
      setCurrentPage(newGroup * 3 + 1);
      return newGroup;
    });
  };

  const pagesToShow = useMemo((): number[] => {
    const pages: number[] = [];
    const startPage = currentPageGroup * 3 + 1;
    const endPage = Math.min(startPage + 2, totalPages);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPageGroup, totalPages]);

  return (
    <>
      <div className={cn("flex flex-col space-y-2 mt-2 mb-2")}>
        {/* Corrected JSX for the grid layout */}
        {currentProductsToDisplay.length > 0 ? (
          currentProductsToDisplay.map((productRow: ProductGrouped[], rowIndex: number) => (
            <div key={rowIndex} className='flex justify-center items-center sm:justify-between space-x-5 sm:space-x-2 space-y-4 sm:space-y-0'>
              {productRow.map((product: ProductGrouped, index: number) => (
                // Passing the correct 'product' prop to the component
                <GridViewProductDisplay key={product.product_id || index} loading={loading} product={product} />
              ))}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg py-10">No products to display.</p>
        )}

        {/* Your pagination component */}
        <div className="flex justify-end items-center w-full h-15 bg-white text-black space-x-4 pr-4 mt-4">
          <Select onValueChange={handleShowSelectChange} defaultValue={itemsPerPage.toString()}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Show 9" className='data-[placeholder]:text-black' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>How many products display per page?</SelectLabel>
                <SelectItem value="3">Show 9</SelectItem>
                <SelectItem value="4">Show 12</SelectItem>
                <SelectItem value="5">Show 15</SelectItem>
                <SelectItem value="6">Show 18</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex items-center rounded-md border border-gray-300 overflow-hidden shadow-sm h-9">
            <Button
              variant="ghost"
              onClick={handlePreviousGroup}
              disabled={currentPageGroup === 0}
              className="rounded-none hover:bg-gray-200 w-10 h-10"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600 ml-5 mr-5" />
            </Button>
            {pagesToShow.map((page) => (
              <Button
                key={page}
                variant="ghost"
                className={`rounded-none px-4 py-2 ${page === currentPage
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'hover:bg-gray-200 text-gray-700'
                  }`}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="ghost"
              onClick={handleNextGroup}
              disabled={(currentPageGroup + 1) * 3 >= totalPages}
              className="rounded-none hover:bg-gray-200  w-10 h-10"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}