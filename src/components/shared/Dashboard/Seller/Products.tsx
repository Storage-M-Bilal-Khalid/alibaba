"use client"
import { Button } from "@/components/ui/button"
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from 'react'
import Filters from "./Filters"
import { CreateProduct } from "./Functions/CreateProduct"
import DetailOfProduct from "./Functions/DetailOfProduct"
import UpdateProduct from "./Functions/UpdateProduct"
import { ProductGrouped } from "./data"

function sliceArrayIntoChunks<T>(arr: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}



interface GridViewProductDisplayProps {
  loading: boolean;
  product: ProductGrouped; // assuming this is your grouped product type
}

function GridViewProductDisplay({ loading, product }: GridViewProductDisplayProps) {
  return (
    <div className='border-1 bg-white border-[#dee2ef] grid grid-rows-[7fr_3fr] p-3 rounded-[5]'>
      {
        loading
          ?
          <></>
          :
          <>
            <div className='border-b-1 border-[#eff2f4] flex items-center justify-center'>
              <img src={product.images[0]} alt="Pic" className='w-50 h-50 object-contain' />
            </div>
            <div className=' grid grid-cols-[8.5fr_1.5fr] pt-3'>
              <div>
                <h1 className="text-[#1c1c1c] text-sm font-medium">
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
                    3
                    {/* {props.rating} */}
                  </li>
                </ol>
                <h2 className="text-[#606060] text-sm">
                  {product.title}
                </h2>
                <Button variant="link" className="underline text-[#0d6efd] cursor-pointer pl-[0]">
                  <Link href={`/productDetail/${product.product_id}`} target='_blank'>View Details</Link>
                </Button>
              </div>
              <div className="w-auto h-8   flex items-center justify-center space-x-2">
                  <UpdateProduct/>
                  <DetailOfProduct/>
              </div>
            </div>
          </>
      }
    </div>
  )
}

export const GridView = ({ loading, products }: { loading: boolean; products: ProductGrouped[] }) => {
  const [columns, setColumns] = useState(3);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const wrapper = document.getElementById("grid-wrapper");

    if (!wrapper) return;

    const updateColumns = () => {
      const width = wrapper.offsetWidth;
      const newColumns = width < 710 ? 2 : 3;

      if (newColumns !== columns) {
        setAnimate(true); // trigger animation class
        setTimeout(() => setAnimate(false), 300); // remove after animation
        setColumns(newColumns);
      }
    };

    updateColumns(); // initial check

    const resizeObserver = new ResizeObserver(updateColumns);
    resizeObserver.observe(wrapper);

    return () => resizeObserver.disconnect();
  }, [columns]);

  //Testing
  const slicedProducts = sliceArrayIntoChunks(products, columns);


  // Pagination logic remains same
  const [itemsPerPage, setItemsPerPage] = useState<number>(2);
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
    <div className="w-full min-h-40 flex flex-col justify-between items-center">
      {
        loading
          ?
          <></>
          :
          <>
            <div
              className={cn(
                " grid gap-4 transition-all duration-300 ease-in-out ",
                columns === 2 ? "grid-cols-2" : "grid-cols-3",
                animate && "animate-columnChange"
              )}
            >
              {currentProductsToDisplay.flat().map((product, index) => (
                <GridViewProductDisplay key={index} loading={loading} product={product}/>
              ))}
            </div>

            <div className="flex justify-end items-center w-full h-15 border-1 bg-white border-[#dee2ef] rounded-[5] space-x-4 pr-4 mt-4"> {/* Added pr-4 for right padding */}
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
                  // size="icon"
                  onClick={handleNextGroup}
                  disabled={(currentPageGroup + 1) * 3 >= totalPages}
                  className="rounded-none hover:bg-gray-200   w-10 h-10"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            </div>
          </>
      }

    </div>
  );
};

interface ProductsProps{
  sellerId:string
  stripeAccountId:string
}

interface FormData {
  category: number;
  selectedBrands: number | number[];
  selectedFeatures: number | number[];
  selectedManufacturers: number | number[];
  selectedRatings: number[];
  condition: string;
  minPrice: number;
  maxPrice: number;
}

export default function Products({sellerId,stripeAccountId}:ProductsProps) {
   const [filters, setFilters] = useState<FormData | null>(null);
   const handleFilterChange = (newFilters: FormData) => {
       setFilters(newFilters);
       console.log(`New Filters`)
       console.log(newFilters)
     };
  const [products, setProducts] = useState<ProductGrouped[]>([]);
  const [productLoad, setProductLoad] = useState(true)

   
  useEffect(() => {
    const viewproducts = async () => {
      try {
        setProductLoad(true);
        let res;
        if (filters) {
          console.log(`Hit req at api/customers`);
          console.log(filters)
          res = await fetch(`/api/view-products/customers`, {
            method: 'POST',
            body: JSON.stringify(filters)
          })
        } else {
          res = await fetch(`/api/view-products/sellers`, {
            method: 'GET',
          });
        }
        if (!res.ok) {
          console.log(`Error`);
          setProductLoad(false);
          return;
        }
        const data = await res.json();
        if (data && data.result) {
          setProducts(data.result);
          setProductLoad(false);
          console.log('Fetched Products:', data.result);
        } else {
          console.log(`Error`);
          setProductLoad(false);
        }
      } catch (err: any) {
        console.log(`Error`);
        setProductLoad(false);
      }
    };
    viewproducts();
  }, [filters]); 

  // useEffect(() => {
  //   const viewproducts = async () => {
  //     try {
  //       setProductLoad(true);
  //       const res = await fetch('/api/view-products/sellers', {
  //         method: 'GET',
  //       });

  //       if (!res.ok) {
  //         console.log(`Error`)
  //         return;
  //       }
  //       const data = await res.json();
  //       if (data && data.result) {
  //         setProducts(data.result);
  //         setProductLoad(false);
  //         console.log('Fetched Products:', data.result);
  //       } else {
  //         console.log(`Error`)
  //       }
  //     } catch (err: any) {
  //       console.log(`Error`)
  //     }
  //   };
  //   viewproducts();
  // }, []);

  return (
    <>
      <div className="h-auto w-full flex justify-end p-5">
        <CreateProduct stripeAccountId={stripeAccountId} sellerId={sellerId}/>
      </div>
      <section className="grid grid-cols-[3.5fr_8fr] m-3 gap-x-5">
        <Filters onFilterChange={handleFilterChange}/>
        <div className="flex " id="grid-wrapper">
          <GridView loading={productLoad} products={products} />
        </div>

      </section>
    </>
  )
}