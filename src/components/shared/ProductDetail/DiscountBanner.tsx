import { Button } from "@/components/ui/button";

interface DiscountBannerProps {
    title: string;
    description: string;
    buttonText: string;
    onButtonClick?: () => void; // Optional click handler for the button
}

const DiscountBanner: React.FC<DiscountBannerProps> = ({
    title,
    description,
    buttonText,
    onButtonClick,
}) => {
    return (
        <div className="relative bg-[#237cff] overflow-hidden flex items-center justify-between p-6 rounded-lg shadow-lg">
            {/* Angled background element */}
            <div
                className="absolute inset-y-0 right-0 w-3/5 md:w-2/5 bg-[#005ade] transform -skew-x-12 origin-bottom-right"
                aria-hidden="true" // Hide from screen readers as it's purely decorative
            ></div>

            {/* Content */}
            <div className="relative z-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between w-full">
                <div>
                    <h3 className="text-2xl font-bold mb-1">{title}</h3>
                    <p className="text-sm opacity-90">{description}</p>
                </div>
                <Button
                    className="mt-4 md:mt-0 md:ml-8 px-6 py-2 bg-orange-400 text-white rounded-md transition-colors duration-200 cursor-pointer"
                    onClick={onButtonClick}
                >
                    {buttonText}
                </Button>
            </div>
        </div>
    );
};

export default DiscountBanner