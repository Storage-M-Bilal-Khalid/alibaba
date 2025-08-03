"use client"

import {
  IconInnerShadowTop
} from "@tabler/icons-react"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { User2 } from "lucide-react"
import { useState } from "react"
import { SellerDashboardTab, sellers } from "./shared/Dashboard/Seller/data"


export function AppSidebar({ onMenuItemClick, specificId, stripeAccountId, ...props }: React.ComponentProps<typeof Sidebar> & { onMenuItemClick: (content: SellerDashboardTab) => void, specificId: number, stripeAccountId: string }) {
  const [connectStripeLoading, setConnectStripeLoading,] = useState(false);
  let sellerId = specificId;

  const connectStripe = async (sellerId: number) => {
    alert(sellerId);
    setConnectStripeLoading(true);
    try {
      const res = await fetch('/api/stripe/create-account-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sellerId }),
      });
      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      console.error('Stripe connection failed:', err);
      setConnectStripeLoading(false);
    }
  };



  return (
    <Sidebar collapsible="offcanvas" {...props} className="bg-[#f7fafc] p-2 border-0 text-[#505050]">
      <SidebarHeader className="bg-[#f7fafc]">
        <SidebarMenu className="bg-[#f7fafc]">
          <SidebarMenuItem className="bg-[#f7fafc]">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-[#f7fafc] ">
        {
          stripeAccountId === 'placeholder'
            ?
            <SidebarMenuButton tooltip="" className="p-5 cursor-pointer bg-white rounded-[5] border-1 border-[#dee2e7b2] hover:text-[#606060] hover:bg-[#fcfcfc]" onClick={() => connectStripe(sellerId)}>
              <User2 />
              <span className="">Connect Stripe</span>
            </SidebarMenuButton>
            :
            <NavMain items={sellers} onMenuItemClick={onMenuItemClick} />
        }
      </SidebarContent>
      <SidebarFooter className="bg-[#f7fafc]">
      </SidebarFooter>
    </Sidebar >
  )
}
