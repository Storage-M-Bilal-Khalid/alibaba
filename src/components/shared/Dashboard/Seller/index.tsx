import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

import { useState } from "react"
import DashboardOverview from "./Dashboard";
import Products from "./Products";

import Orders from "./Orders"
import Earnings from "./Earnings"
import CustomerMessages from "./CustomerMessages"
import Settings from "./Settings"
import { SellerDashboardTab } from "./data";

interface SellerDashboardProps {
    specificId: number,
    stripeAccountId: string
}

export default function SellerDashboard({ specificId, stripeAccountId }: SellerDashboardProps) {

    const [activeContent, setActiveContent] = useState<SellerDashboardTab>('overview');


    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="sidebar" className="border-0" onMenuItemClick={setActiveContent} specificId={specificId} stripeAccountId={stripeAccountId} />
            <SidebarInset className="bg-white border-0">
                <SiteHeader />
                {
                    stripeAccountId !== 'placeholder'
                        ?
                        <div className="flex flex-1 flex-col bg-[#f7fafc]">
                            {activeContent === 'overview' && <DashboardOverview />}
                            {activeContent === 'products' && <Products stripeAccountId={stripeAccountId} sellerId={String(specificId)}/>}
                        </div>
                        :
                        <div className="flex flex-1 flex-col bg-[#f7fafc] p-20 space-y-10 text-sm text-[#505050]">
                            <h1 className="text-xl font-medium">Ready to get started? Connect your Stripe account!</h1>
                            <p className="text-sm text-[#505050]">To create products, manage orders, and receive payments, you'll need to connect your Stripe account. Stripe is our trusted payment processor that handles all transactions securely.</p>

                            <p>It only takes a few minutes to set up.</p>

                            <p>
                                You can connect your Stripe account by clicking the "Connect Stripe" button in the sidebar on the left. Once connected, your dashboard will be fully unlocked, and you can start building your store</p>
                        </div>
                }

            </SidebarInset>
        </SidebarProvider>
    )
}
