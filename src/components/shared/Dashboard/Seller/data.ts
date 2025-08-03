"use client"

import {
    Icon,
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconInnerShadowTop,
  IconListDetails,
  IconUsers
} from "@tabler/icons-react"


type ConditionOfProduct = 1 | 2 | 3 | 4

export type ProductGrouped = {
  product_id: number;
  title: string;
  description: string;
  stock:number
  condition:ConditionOfProduct;
  price: number;
  brand: string;
  feature: string;
  manufacturer: string;
  images: string[];
};


export type ProductRow = {
    product_id: number;
    title: string;
    description: string;
    condition_id:ConditionOfProduct;
    tierone_price: number;
    stock:number
    brand_name: string;
    feature_name: string;
    manufacturer_name: string;
    image_url: string;
};


export type SellerDashboardTab =
        | 'overview'
        | 'products'
        | 'orders'
        | 'earnings'
        | 'customerMessages'
        | 'settings';

export const sellers  = [
    {
      title: "Dashboard ",
      url: "#",
      icon: IconDashboard,
      content: 'overview' as SellerDashboardTab
    },
    {
      title: "Products",
      url: "#",
      icon: IconListDetails,
      content: 'products' as SellerDashboardTab
    },
    {
      title: "Orders",
      url: "#",
      icon: IconChartBar,
      content: 'orders' as SellerDashboardTab
    },
    {
      title: "Earnings",
      url: "#",
      icon: IconFolder,
      content: 'earnings' as SellerDashboardTab
    },
    {
      title: "Customer Messages",
      url: "#",
      icon: IconUsers,
      content: 'customerMessages' as SellerDashboardTab
    },
    {
      title: "Settings",
      url: "#",
      icon: IconUsers,
      content: 'settings' as SellerDashboardTab
    },
]