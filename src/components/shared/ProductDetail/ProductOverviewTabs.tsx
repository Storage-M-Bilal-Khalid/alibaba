"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";

interface ProductSpec {
    label: string;
    value: string;
}

const productSpecifications: ProductSpec[] = [
    { label: 'Model', value: '#8786867' },
    { label: 'Style', value: 'Classic style' },
    { label: 'Certificate', value: 'ISO-898921212' },
    { label: 'Size', value: '34mm x 450mm x 19mm' },
    { label: 'Memory', value: '36GB RAM' },
];

const productFeatures: string[] = [
    'Some great feature name here',
    'Lorem ipsum dolor sit amet, consectetur',
    'Duis aute irure dolor in reprehenderit',
    'Some great feature name here',
];

const productDescriptionContent = (
    <div className="flex flex-col space-y-5 pb-1 min-h-[500px]">
        <p className="text-[#505050]">
            "Introducing the J. 'Effortless Elegance' Premium Cotton Shirt**, your ultimate wardrobe staple crafted from 100% luxurious, breathable cotton for unparalleled comfort and a soft feel against your skin. Designed with a modern, tailored fit that flatters every silhouette, this versatile shirt seamlessly transitions from professional settings to casual outings, offering a sophisticated yet relaxed look. Built for durability and ease of care, it retains its pristine quality wash after wash, making it an indispensable piece that combines timeless style with everyday practicality, ensuring you look sharp and feel great all day long."
        </p>
        <Table className="border-1 border-[#dee2ef]">
            <TableBody >
                {productSpecifications.map((currentValue, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium bg-[#eff2f4] text-[#505050]">{currentValue.label}</TableCell>
                        <TableCell className="text-left text-[#505050]">{currentValue.value}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        {
            productFeatures.map((currentValue, index) => (
                <div className="flex space-x-3 p-0 m-0 space-y-3" key={index}>
                    <Check className="w-4 h-4 text-[#00b517] mt-1" />
                    <p className="text-[#505050]">{currentValue}</p>
                </div>
            ))
        }
    </div>
);

const reviewsContent = (
    <>
        <div className="min-h-[500px]">
            <p className="text-[#505050]">
                "Absolutely thrilled with this shirt! The fabric feels incredibly soft and high-quality, much better than I expected for the price, and it fits perfectly - not too tight, not too loose. I've worn it to the office and casually on weekends, and it holds up beautifully through washes, showing no signs of fading or shrinkage. It's quickly become my favorite shirt, offering both comfort and a sharp look, and I'll definitely be buying more in different colors soon."
            </p>
        </div>
    </>
);

const shippingContent = (
    <>
        <div className="min-h-[500px]">
            <p className="text-[#505050]">
                "We strive to get your order to you as quickly as possible, typically processing all orders within 1-2 business days from purchase. Once dispatched, standard delivery usually takes between 5-7 business days across most regions, utilizing reliable carriers to ensure safe and timely arrival of your new favorite shirt. You'll receive a tracking number via email as soon as your package ships, allowing you to monitor its journey right to your doorstep, with expedited options also available for those who need their items even sooner."
            </p>
        </div>
    </>
);

const aboutSellerContent = (
    <>
        <div className="min-h-[500px]">
            <p className="text-[#505050]">
                "We are [Muhammad Bilal Khalid, e.g., 'Elegance Threads' or 'Premium Apparel Co.'], a dedicated team passionate about delivering high-quality apparel that blends modern style with lasting comfort. With years of experience in the fashion industry, we meticulously select our materials and partner with ethical manufacturers to ensure every garment meets our rigorous standards for craftsmanship and durability. Our commitment extends beyond the product to exceptional customer service, striving to provide a seamless shopping experience and ensuring complete satisfaction with every purchase, because your style and comfort are our top priorities."
            </p>
        </div>
    </>
);

const tabs = [
    {
        name: "Description",
        value: "description",
        content: productDescriptionContent
    },
    {
        name: "Reviews",
        value: "reviews",
        content: reviewsContent
    },
    {
        name: "Shipping",
        value: "shipping",
        content: shippingContent
    },
    {
        name: "About Seller",
        value: "aboutSeller",
        content: aboutSellerContent
    },
];

export function ProductOverviewTabs() {
    return (
        <Tabs defaultValue={tabs[0].value} className=" w-full  bg-white rounded-[5] border-1 border-[#dee2ef]">
            <TabsList className="w-full py-3 px-6 bg-white justify-start rounded-tr-[5] rounded-tl-[5] rounded-br-none rounded-bl-none h-full  border-b-1 border-[#dee2ef] ">
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="text-[#8b96a5]  h-full data-[state=active]:text-[#0d6efd] flex justify-between"
                    >
                        <span className="cursor-pointer">{tab.name}</span>
                    </TabsTrigger>
                ))}
            </TabsList>
            {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="px-5 py-3">
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
}