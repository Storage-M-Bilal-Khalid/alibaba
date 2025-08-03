"use client"
import { useWindowWidth } from "@/hooks/useWindowWidth";
import InquiryForm from "./inquiryForm";

export default function InquiryFormSection() {
    const inner_width  = useWindowWidth(950);
    // useEffect(() => {
    //     const handleResize = () => {
    //         setIs_inner_width(window.innerWidth < 950); // Adjust breakpoint as needed
    //     };

    //     handleResize(); // Set initial state
    //     window.addEventListener('resize', handleResize);
    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);
    return (
        <>
            {
                !inner_width
                    ?
                    <>
                        <section className="rounded-[5] border-1 border-[#8B96A5] bg-[url('/assets/Image/backgrounds/BackgroundPicture.png')] bg-cover bg-center bg-no-repeat w-full h-[420px] grid grid-cols-[1.3fr_1fr] ">
                            <div className="text-white pl-12 pt-8 flex flex-col gap-5">
                                <h1 className="text-3xl font-semibold">
                                    An easy way to send <br /> requests to all suppliers
                                </h1>
                                <p className="text-sm">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing <br /> elit, sed do eiusmod tempor incididunt.
                                </p>
                            </div>
                            <div className="pt-8 pr-12">
                                <InquiryForm />
                            </div>
                        </section>
                    </>
                    :
                    <h1>Inquiry Form Section</h1>
            }
        </>
    )
}