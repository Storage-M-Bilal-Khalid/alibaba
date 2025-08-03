import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';


interface FormData {
    category: number,
    selectedBrands: number[];
    selectedFeatures: number[];
    selectedManufacturers: number[];
    selectedRatings: number[];
    condition: string,
    minPrice: number,
    maxPrice: number
}

interface PriceRangeFilterProps {
    setValue: UseFormSetValue<FormData>;
    watch: UseFormWatch<FormData>;
}


export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ setValue, watch }) => {

    const minPrice = watch("minPrice");
    const maxPrice = watch("maxPrice");

    const handleSliderChange = (values: number[]) => {
        setValue("minPrice", values[0]);
        setValue("maxPrice", values[1]);
    };

    const handleMinInputChange = (e: any) => {
        const value = Number(e.target.value);
        setValue("minPrice", value);
    };

    const handleMaxInputChange = (e: any) => {
        const value = Number(e.target.value);
        setValue("maxPrice", value);
    };

    return (
        <div className="pt-4  rounded-lg  w-full max-w-sm">

            <div className="px-2 mb-6">
                <Slider
                    min={0}
                    max={999999}
                    step={1}
                    value={[minPrice, maxPrice]}
                    onValueChange={handleSliderChange}
                    className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                />
            </div>

            <div className="flex justify-between items-center gap-4 ">
                <div className="flex-1">
                    <label htmlFor="min-price" className="block text-sm font-medium text-gray-700 mb-1">
                        Min
                    </label>
                    <Input
                        id="min-price"
                        type="number"
                        value={minPrice}
                        onChange={handleMinInputChange}
                        className="w-full text-center"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="max-price" className="block text-sm font-medium text-gray-700 mb-1">
                        Max
                    </label>
                    <Input
                        id="max-price"
                        type="number"
                        value={maxPrice}
                        onChange={handleMaxInputChange}
                        className="w-full text-center"
                    />
                </div>
            </div>

        </div>
    );
};