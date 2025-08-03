"use client"

import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SellerDashboardTab } from "./shared/Dashboard/Seller/data"

export function NavMain({
  items,
  onMenuItemClick, 
}: {
  items: {
    title: string
    url: string
    icon: Icon
    content: SellerDashboardTab 
  }[]
  onMenuItemClick: (content:SellerDashboardTab) => void 
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="space-y-3">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} className="p-5 cursor-pointer bg-white rounded-[5] border-1 border-[#dee2e7b2] hover:text-[#606060] hover:bg-[#fcfcfc]" onClick={() => onMenuItemClick(item.content)} >
                {item.icon && <item.icon />}
                <span className="">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
