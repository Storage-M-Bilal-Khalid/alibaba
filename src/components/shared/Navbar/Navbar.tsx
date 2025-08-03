"use client"
import { useWindowWidth } from "@/hooks/useWindowWidth";
import MaxWidthWrapper from "../MaxWidthWrapper";
import DesktopMainHeader, { DesktopSecondaryHeader } from "./Desktop";
import MobileHeader from "./Mobile";

export default function Navbar() {
    const isMobile = useWindowWidth(950);
    return (
        <>
            {
                isMobile ?
                <div className="bg-white">
                    <MaxWidthWrapper>
                        <MobileHeader />
                    </MaxWidthWrapper>
                </div>
                    :
                    <>
                    <div  className="border-b-[1px] border-[#8B96A5] bg-white">
                        <MaxWidthWrapper>
                            <DesktopMainHeader />
                        </MaxWidthWrapper>
                    </div>
                    <div  className="border-b-1 border-[#8B96A5] bg-white">
                        <MaxWidthWrapper>
                            <DesktopSecondaryHeader />
                        </MaxWidthWrapper>
                    </div>
                    </>
            }
        </>
    )
}