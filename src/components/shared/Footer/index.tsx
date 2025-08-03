"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Linkedin, Mail, Twitter, Youtube } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Image from "next/image";
import { Icons } from "@/components/Icon";
import { useWindowWidth } from "@/hooks/useWindowWidth";

const newsletterSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export default function Footer() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<NewsletterFormValues>({
        resolver: zodResolver(newsletterSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (data: NewsletterFormValues) => {
        console.log("Newsletter subscribed with email:", data.email);
        alert(`Subscribed with email: ${data.email}`);
        reset();
    };


    interface FooterColumn {
        title: string;
        links: string[];
    }

    const footerLinks: FooterColumn[] = [
        {
            title: "About",
            links: [
                "About Us",
                "Find store",
                "Categories",
                "Blogs"
            ]
        },
        {
            title: "Partnership",
            links: [
                "About Us",
                "Find store",
                "Categories",
                "Blogs"
            ]
        },
        {
            title: "Information",
            links: [
                "Help Center",
                "Money Refund",
                "Shipping",
                "Contact us"
            ]
        },
        {
            title: "For users",
            links: [
                "Login",
                "Register",
                "Settings",
                "My Orders"
            ]
        },
        {
            title: "Get app",
            links: [
                "/assets/playstore.png",
                "/assets/applestore.png"
            ]
        }
    ];
    const innerWidth = useWindowWidth(950)
    return (
        <>
            {
                !innerWidth
                    ?
                    <>
                        <div className="mt-5">
                            <section className="flex flex-col justify-center items-center p-12 bg-[#eff2f4]">
                                <h1 className="font-semibold text-[#1c1c1c]">
                                    Subscribe on our newsletter
                                </h1>
                                <p className="text-[#606060] text-sm">
                                    Get daily news on upcoming offers from many suppliers all over the world
                                </p>
                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row space-x-2 mt-4">
                                    <div className="relative w-[300px]">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <Input
                                            type="email"
                                            placeholder="Email"
                                            className="bg-white text-gray-800 w-full rounded-[4] pl-10 pr-4 py-2 border border-gray-300"
                                            {...register("email")}
                                        />
                                        {errors.email && (
                                            <p className="absolute text-red-500 text-xs mt-1 -bottom-5 left-0">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-[120px] p-2 rounded-[4] bg-[#0A74FF] text-white transition-all duration-300 ease-in-out hover:underline hover:cursor-pointer"
                                        variant="default"
                                    >
                                        Subscribe
                                    </Button>
                                </form>
                            </section>
                            <section className="w-full bg-white pt-4 pb-4">
                                <MaxWidthWrapper>
                                    <div className="grid grid-cols-[1fr_2.5fr] pt-8 pb-8 gap-x-12">
                                        <div className="flex flex-col gap-y-4">
                                            <Icons.logo className="w-10 h-10" />
                                            <p className="text-[#8b96a5] text-sm">
                                                Best information about the company gies here but now lorem ipsum is
                                            </p>
                                            <div className="flex gap-x-4">
                                                <div className="bg-[#bdc4cd] rounded-full w-10 h-10 flex items-center justify-center text-white">
                                                    <Facebook className="h-6 w-6 text-white  hover:text-blue-700 transition-all duration-300 ease-in-out cursor-pointer" />
                                                </div>
                                                <div className="bg-[#bdc4cd] rounded-full w-10 h-10 flex items-center justify-center text-white">
                                                    <Twitter className="h-6 w-6 text-white  hover:text-blue-400 transition-all duration-300 ease-in-out cursor-pointer" />
                                                </div>
                                                <div className="bg-[#bdc4cd] rounded-full w-10 h-10 flex items-center justify-center text-white">
                                                    <Linkedin className="h-6 w-6 text-white hover:text-blue-500 transition-all duration-300 ease-in-out cursor-pointer" />
                                                </div>
                                                <div className="bg-[#bdc4cd] rounded-full w-10 h-10 flex items-center justify-center text-white">
                                                    <Instagram className="h-6 w-6 text-white hover:text-orange-400 transition-all duration-300 ease-in-out cursor-pointer" />
                                                </div>
                                                <div className="bg-[#bdc4cd] rounded-full w-10 h-10 flex items-center justify-center text-white">
                                                    <Youtube className="h-6 w-6 text-white hover:text-red-400 transition-all duration-300 ease-in-out cursor-pointer" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full grid grid-cols-[1fr_1fr_1fr_1fr_1fr_]">
                                            {footerLinks.map((column, colIndex) => (
                                                <div key={colIndex}>
                                                    <h3 className="text-[#1c1c1c] text-shadow-sm shadow-[#1c1c1c]-100/50">{column.title}</h3>
                                                    <ul className="mt-3">
                                                        {column.links.map((link, linkIndex) => (
                                                            <li key={linkIndex} className="pb-2 text-sm text-[#8b96a5] cursor-pointer hover:underline transition-all duration-300 ease-in-out">
                                                                {
                                                                    footerLinks.length - 1 === colIndex
                                                                        ?
                                                                        <div className="bg-black p-2 w-25 rounded-[8]">
                                                                            <Image src={link} alt="Picture" priority width={100} height={100} />
                                                                        </div>
                                                                        :
                                                                        link
                                                                }
                                                            </li>
                                                        ))}

                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </MaxWidthWrapper>
                            </section>
                            <section className="w-full bg-[#eff2f4] h-[70px]">
                                <MaxWidthWrapper className=" flex justify-between items-center pt-[12px] text-[#1c1c1c]  text-shadow-sm shadow-[#1c1c1c]-100/50 text-sm">
                                    <p>
                                        © 2025 Ecommerce
                                    </p>
                                    <p>
                                        Designed and developed by <br /> Engr Muhammad Bilal Khalid
                                    </p>
                                </MaxWidthWrapper>
                            </section>
                        </div>
                    </>
                    :
                    <h1>Footer Area Remaining</h1>
            }
        </>
    );
}














































































