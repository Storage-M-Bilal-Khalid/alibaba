"use client";

import { productCategories } from "@/components/shared/ProductPage/configuration/configuration";
// You can group the seller form into these steps or sections:

// Basic Info – title, description, category, condition, stock, price

// Images Upload – upload 3 to 6 images

// Quantity Pricing – add tiers (optional)

// Metadata Tags – select brands, features, manufacturers (optional)

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { errorNotifier, successNotifier } from "@/lib/designPatterns/notificationTrigger";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, PlusCircleIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";


interface CreateProductDialogProps {
  sellerId:string,
  stripeAccountId:string,
  open: boolean;
  onClose: () => void;
}

interface CreateProductsProps{
  sellerId:string
  stripeAccountId:string
}

export function CreateProduct({sellerId,stripeAccountId}:CreateProductsProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        onClick={handleOpen}
        className="w-[240px] p-2 rounded bg-white text-[#0A74FF] border border-[#DEE2E7] hover:tracking-wide transition-all duration-300 ease-in-out hover:cursor-pointer hover:text-[#606060] hover:bg-[#f7fafc]"
      >
        <PlusCircleIcon className="w-5 h-4 mr-2" />
        Create New Product
      </Button>

      <CreateProductDialog open={open} onClose={handleClose} stripeAccountId = {stripeAccountId} sellerId={sellerId}/>
    </>
  );
}


export default function CreateProductDialog({ open, onClose ,stripeAccountId,sellerId}: CreateProductDialogProps) {
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) setShow(true);
    else {
      const timeout = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  const createProductSchema = z.object({
    title: z.string().min(2, {
      message: 'Name must be at least 2 characters.',
    }),
    // unitPrice: z.string(),
    stock: z.string(),
    pricingTier: z.object({
      tier1: z.string().nonempty("Required"),
      tier2: z.string().nonempty("Required"),
      tier3: z.string().nonempty("Required"),
    }),
    description: z.string().optional(),
    productImages: z
      .array(z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
        message: 'Max file size is 5MB.',
      })).min(1, { message: 'Please select at least one image.' }),
    condition: z.enum(['refurbished', 'brandNew', 'oldItem'], {
      message: "Please select a valid condition (Refurbished or Brand New or Old Item).",
    }),
    category: z.string(),
    brand: z.string(),
    feature: z.string(),
    manufacturer: z.string()
  });

  const form = useForm<z.infer<typeof createProductSchema>>({
    resolver: zodResolver(createProductSchema),
    mode: "onChange",
    defaultValues: {
      title: '',
      // unitPrice: "",
      stock: "",
      pricingTier: {
        tier1: '',
        tier2: '',
        tier3: '',
      },
      description: '',
      productImages: undefined,
      condition: 'brandNew',
      category: undefined,
      brand: undefined,
      feature: undefined,
      manufacturer: undefined
    },
  });

  const { formState: { isValid } } = form;

  const selectedCategoryId = form.watch("category");


  const selectedCategory = productCategories.find(
    (category) => category.id.toString() === selectedCategoryId
  );

  const availableBrands = selectedCategory ? selectedCategory.brands : [];
  const availableFeatures = selectedCategory ? selectedCategory.features : [];
  const availableManufacturers = selectedCategory ? selectedCategory.manufacturers : [];

  useEffect(() => {
    if (selectedCategoryId) {
      form.setValue("brand", "");
      form.setValue("feature", "");
      form.setValue("manufacturer", "");
    }
  }, [selectedCategoryId, form.setValue]);

  const [productCreation, setProductCreation] = useState(false);

  if (!open && !show) return null;

  const onSubmit = async (values: z.infer<typeof createProductSchema>) => {

    console.log(values)
    const createProduct = async () => {
      setProductCreation(true)
      let errorOccurred = false;
      const formData = new FormData();
  
      formData.append('title', values.title);
      formData.append('description', values.description || 'Nice Product');
      // formData.append('price', values.unitPrice);
      formData.append('stock', values.stock);
      formData.append('category_id', values.category);
      formData.append('brands', values.brand);
      formData.append('features', values.feature);
      formData.append('manufactures', values.manufacturer);
      formData.append('condition_id', values.condition);
      formData.append('tierOne_price', values.pricingTier.tier1);
      formData.append('tierTwo_price', values.pricingTier.tier2);
      formData.append('tierThree_price', values.pricingTier.tier1);
      formData.append('stripeAccountId',stripeAccountId)

      formData.append('seller_id', sellerId);

      // Append image files to FormData
      values.productImages.forEach(image => {
        formData.append('images', image);
      });

      try {
        const res = await fetch('/api/create-products', {
          method: 'POST',
          body: formData,
        });
        if (res.status === 200) {
          alert(`Submit successfully!`)
        }
        if (res.status === 400) {
          alert(`No Submission!`)
        }
      } catch (error) {

      } finally {
        setProductCreation(false)
        form.reset();
      }
    }
    createProduct();

  };


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
          relative w-[70vw] h-[95vh] overflow-scroll bg-white rounded-[5] p-6 border border-[#dee2ef]
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
        <div className={`flex flex-col justify-center py-2 px-10}`}>
          <h2 className="text-5xl font-bold mb-6 text-[#505050] text-center ">
            Create New Product
          </h2>
          <p className="mb-6 text-sm text-[#606060] text-center">
            Launch a new product
          </p>
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 px-20">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel className="text-[#606060]">Product Title</FormLabel>
                      <FormMessage className="text-red-500" />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Enter product title"

                        {...field}
                        className="bg-white text-[#606060] border-[#dee2e7] rounded-[5]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* <div className="flex space-x-5"> */}
                {/* <FormField
                  control={form.control}
                  name="unitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between w-[530px]">
                        <FormLabel className="text-[#606060]">1 Unit Price</FormLabel>
                        <FormMessage className="text-red-500" />
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Enter 1 unit price"
                          type="number"
                          {...field}
                          className="bg-white text-[#606060] border-[#dee2e7] rounded-[5]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between ">
                        <FormLabel className="text-[#606060]">Stock</FormLabel>
                        <FormMessage className="text-red-500" />
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Enter stock"
                          type="number"
                          {...field}
                          className="bg-white text-[#606060] border-[#dee2e7] rounded-[5]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              {/* </div> */}
              <div className="flex space-x-[14px]">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Category</FormLabel>
                      <FormMessage className="text-red-500" />
                      <Select onValueChange={field.onChange} value={String(field.value)}>
                        <FormControl>
                          <SelectTrigger className="bg-white w-[135px]  text-gray-900 border-[#dee2e7]">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-gray-300">
                          {productCategories.slice(1).map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                              className="hover:bg-gray-100 text-gray-900"
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                {selectedCategoryId && selectedCategoryId !== productCategories[0].id.toString() && (
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Brand</FormLabel>
                        <FormMessage className="text-red-500" />
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white w-[135px]  text-gray-900 border-[#dee2e7]">
                              <SelectValue placeholder="Select a brand" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-gray-300">
                            {availableBrands.map((brand) => (
                              <SelectItem
                                key={brand.id}
                                value={brand.id.toString()}
                                className="hover:bg-gray-100 text-gray-900"
                              >
                                {brand.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                )}
                {selectedCategoryId && selectedCategoryId !== productCategories[0].id.toString() && (
                  <FormField
                    control={form.control}
                    name="feature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Feature</FormLabel>
                        <FormMessage className="text-red-500" />
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-[135px] bg-white text-gray-900 border-[#dee2e7]">
                              <SelectValue placeholder="Select a feature" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-gray-300">
                            {availableFeatures.map((feature) => (
                              <SelectItem
                                key={feature.id}
                                value={feature.id.toString()}
                                className="hover:bg-gray-100 text-gray-900"
                              >
                                {feature.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                )}
                {selectedCategoryId && selectedCategoryId !== productCategories[0].id.toString() && (
                  <FormField
                    control={form.control}
                    name="manufacturer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Manufacturer</FormLabel>
                        <FormMessage className="text-red-500" />
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-[135px] bg-white text-gray-900 border-[#dee2e7]">
                              <SelectValue placeholder="Select a manufacturer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-gray-300">
                            {availableManufacturers.map((manufacturer) => (
                              <SelectItem
                                key={manufacturer.id}
                                value={manufacturer.id.toString()}
                                className="hover:bg-gray-100 text-gray-900"
                              >
                                {manufacturer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Condition</FormLabel>
                      <FormMessage className="text-red-500" />
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger
                            className="w-[135px] bg-white text-gray-900 border-[#dee2e7]"
                          >
                            <SelectValue placeholder="Select a condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          className="bg-white border-gray-300"
                        >
                          <SelectItem
                            value="refurbished"
                            className="hover:bg-gray-100 text-gray-900"
                          >
                            Refurbished
                          </SelectItem>
                          <SelectItem
                            value="brandNew"
                            className="hover:bg-gray-100 text-gray-900"
                          >
                            Brand new
                          </SelectItem>
                          <SelectItem
                            value="oldItem"
                            className="hover:bg-gray-100 text-gray-900"
                          >
                            Old item
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>)} />
              </div>
              <div className="flex space-x-5">
                <FormField
                  control={form.control}
                  name="pricingTier.tier1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#606060]">Tier 1  (1 – 100) Units</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Tier 1 price"
                          {...field}
                          className="w-[230px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pricingTier.tier2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#606060]">Tier 2  (101 – 500) Units</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Tier 2 price"
                          {...field}
                          className="w-[230px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pricingTier.tier3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#606060]">Tier 3 (501 – 1500) Units</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Tier 3 price"
                          {...field}
                          className="w-[230px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel className="text-[#606060]">Description</FormLabel>
                      <FormMessage className="text-red-500" />
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Enter Product Description (Max 50 characters)"
                        {...field}
                        className="bg-white text-[#606060] border-[#dee2e7] rounded-[5]"
                        maxLength={50}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productImages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#606060]">Upload Product Images Max size: ~5MB each *</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Upload Product Images"
                        className="mt-1"
                        type="file"
                        multiple
                        onChange={(e) => field.onChange(e.target.files ? Array.from(e.target.files) : [])}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />

                    </FormControl>


                  </FormItem>
                )} />
              <Button
                type="submit"
                className="w-full text-white rounded py-2 bg-[#117dff] hover:underline hover:tracking-wide transition-all duration-300 ease-in-out cursor-pinter"
                disabled={!isValid}
              >
                {
                  isSubmitting
                    ?
                    <LoaderCircle className="w-4 h-4 text-white animate-spin" />
                    :
                    null
                }
                Register
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
