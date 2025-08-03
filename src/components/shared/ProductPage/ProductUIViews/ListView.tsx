"use client"
import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumbs from "@/components/shared/ProductPage/Breadcrumbs";
import Filters from "@/components/shared/ProductPage/Filters";
import { NavbarProductPage } from "@/components/shared/ProductPage/Navbar";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { cn } from "@/lib/utils";
import { Heart, ChevronLeft, ChevronRight, Grid } from "lucide-react"; 
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { ALL_PRODUCTS } from '../configuration/configuration';

export const ListView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPageGroup, setCurrentPageGroup] = useState(0);

  const totalPages = Math.ceil(ALL_PRODUCTS.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = ALL_PRODUCTS.slice(startIndex, endIndex);

  const startPage = currentPageGroup * 3 + 1;
  const pagesToShow = Array.from({ length: 3 }, (_, i) => startPage + i)
    .filter(page => page <= totalPages);

  useEffect(() => {
    if (currentPage < startPage || currentPage >= startPage + 3) {
      setCurrentPageGroup(Math.floor((currentPage - 1) / 3));
    }
  }, [currentPage, startPage]);


  const handlePreviousGroup = () => {
    if (currentPageGroup > 0) {
      setCurrentPageGroup(prev => prev - 1);
      setCurrentPage(currentPageGroup * 3);
    }
  };

  const handleNextGroup = () => {
    if ((currentPageGroup + 1) * 3 < totalPages) {
      setCurrentPageGroup(prev => prev + 1);
      setCurrentPage((currentPageGroup + 1) * 3 + 1);
    }
  };

  const handlePageClick = (pageValue: number) => {
    setCurrentPage(pageValue);
  };

  const handleShowSelectChange = (value: string) => {
    setItemsPerPage(parseInt(value, 10));
    setCurrentPage(1);
    setCurrentPageGroup(0);
  };

  function addedToFavourite() {
    alert(`Add to Fav`)
  }
  return (
    <>
      <div className={cn("flex flex-col space-y-3 mt-3 mb-3")}>
        {
          displayedProducts.map(
            (currentValue, index) => (
              <div key={index} className="w-full flex justify-between p-4 rounded-[5px] border border-[#dee2ef] bg-white">
                <div className="flex space-x-2">
                  <div className="w-50 flex items-center justify-center">
                    <img src={currentValue.imgUrl} alt="Img here" className="w-40 h-40 object-contain" />
                  </div>
                  <div className="flex flex-col justify-between items-start pt-[5px] pb-[10px]">
                    <div className="flex flex-col space-y-1">
                      <h2 className="text-[#1c1c1c] text-xl">
                        {currentValue.name}
                      </h2>
                      <h1 className="text-[#1c1c1c] text-xl font-medium">
                        ${currentValue.price} <del className="text-[#8b96a5] font-normal text-sm ml-1">${currentValue.originalPrice}</del>
                      </h1>
                      <ol className="flex space-x-3">
                        <li>
                          <Rating defaultValue={currentValue.rating}>
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <RatingButton className="text-[#ff9017]" key={idx} />
                            ))}
                          </Rating>
                        </li>
                        <li className="text-[#ff9017]">
                          {currentValue.rating}
                        </li>
                        <li className="text-[#8b96a5]">
                          {currentValue.orders} orders
                        </li>
                        <li className="text-green-600">
                          {currentValue.shipping}
                        </li>
                      </ol>
                      <p>
                        {currentValue.description}
                      </p>
                    </div>
                    <Button variant="link" className="underline text-[#0d6efd] cursor-pointer pl-[0]">
                      <Link href={`/productDetail/${currentValue.id}`} target='_blank'>View Details</Link>
                    </Button>
                  </div>
                </div>
                <div className="w-auto h-8 p-2 rounded-[5px] border border-[#dee2ef] flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#0d6efd] cursor-pointer hover:text-red-500 hover:fill-red-200" onClick={addedToFavourite} />
                </div>
              </div>
            )
          )
        }
      </div>
      <div className="flex justify-end items-center w-full h-15 bg-white text-black space-x-4 pr-4 mt-4">
        <Select onValueChange={handleShowSelectChange} defaultValue={itemsPerPage.toString()}>
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="Show 10" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>How many products display per page?</SelectLabel>
              <SelectItem value="10">Show 10</SelectItem>
              <SelectItem value="20">Show 20</SelectItem>
              <SelectItem value="30">Show 30</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Pagination Buttons */}
        <div className="flex items-center rounded-md border border-gray-300 overflow-hidden shadow-sm h-9">
          <Button
            variant="ghost"
            onClick={handlePreviousGroup}
            disabled={currentPageGroup === 0}
            className="rounded-none hover:bg-gray-200  w-10 h-10"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
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
            className="rounded-none hover:bg-gray-200 w-10 h-10"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>
    </>
  )
}