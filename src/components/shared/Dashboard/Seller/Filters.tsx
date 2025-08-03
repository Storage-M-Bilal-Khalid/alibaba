import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Rating, RatingButton } from '@/components/ui/shadcn-io/rating';
import { CircleChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Checkbox, CheckboxGroupList, Label } from '@/components/shared/ProductPage/CheckBoxOrLabelOrCheckBoxList';
import { PriceRangeFilter } from '@/components/shared/ProductPage/PriceRangeFilter';
import { CategoryData, conditionFilter, productCategories, ratingFilter } from '@/components/shared/ProductPage/configuration/configuration';


interface AccordionItemData {
  id: string;
  title: string;
  content: string | React.ReactNode;
}

interface AccordionItemProps {
  item: AccordionItemData;
  isOpen: boolean;
  onToggle: (id: string) => void;
  isLast: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ item, isOpen, onToggle }) => {
  return (
    <div className={`overflow-hidden  px-3 py-3  rounded-[5]`}>
      <h2 id={`accordion-heading-${item.id}`}>
        <div
          className="flex items-center justify-between  w-full focus:outline-none focus:ring-0 border-b border-[#dee2e7] pb-3 pl-2 pr-2 cursor-pointer"
          onClick={() => onToggle(item.id)}
          aria-expanded={isOpen}
          aria-controls={`accordion-body-${item.id}`}
        >
          <span className=" text-[#606060] ">{item.title}</span>
          <CircleChevronDown className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#1c1c1c]' : 'text-[#8b96a5]'}`} />
        </div>
      </h2>
      <div
        id={`accordion-body-${item.id}`}
        role="region"
        aria-labelledby={`accordion-heading-${item.id}`}
        className={`overflow-hidden ${isOpen ? 'max-h-screen opacity-100 pb-5 pl-2 pr-2 mt-5' : 'max-h-0 opacity-0'}`}
      >
        <div className="text-[#505050] text-sm text-shadow-accent">
          {item.content}
        </div>
      </div>
    </div>
  );
};

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

interface FiltersProps {
  onFilterChange: (filters: FormData) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {

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

  const [openItemIds, setOpenItemIds] = useState<string[]>(['category']);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);

  let { handleSubmit, setValue, watch, getValues } = useForm<FormData>({
    defaultValues: {
      category: 0,
      selectedBrands: [],
      selectedFeatures: [],
      selectedManufacturers: [],
      selectedRatings: [],
      condition: "",       // ✅ Add this
      minPrice: 0,         // ✅ Add this
      maxPrice: 99999,
    },
  });

  const watchedBrands = watch('selectedBrands');
  const watchedFeatures = watch('selectedFeatures');
  const watchedManufacturers = watch('selectedManufacturers');

  const watchedRatings = watch('selectedRatings');


  const handleToggle = (id: string) => {
    setOpenItemIds(prevIds =>
      prevIds.includes(id) ? prevIds.filter(itemId => itemId !== id) : [...prevIds, id]
    );
  };

  const handleCategorySelect = (category: CategoryData) => {
    setSelectedCategory(category);
    setValue('category', category.id);
    setOpenItemIds(['brands']);
    setValue('selectedBrands', []);
    setValue('selectedFeatures', []);
    setValue('selectedManufacturers', []);
    setValue('selectedRatings', []);
  };

  const handleCheckboxChange = (
    id: number,
    type: 'brand' | 'feature' | 'manufacturer' | 'ratings',
    isChecked: boolean
  ) => {
    if (type === 'brand') {
      const currentBrands = getValues('selectedBrands');
      setValue('selectedBrands', isChecked ? [...currentBrands, id] : currentBrands.filter(item => item !== id));
    } else if (type === 'feature') {
      const currentFeatures = getValues('selectedFeatures');
      setValue('selectedFeatures', isChecked ? [...currentFeatures, id] : currentFeatures.filter(item => item !== id));
    } else if (type === 'manufacturer') {
      const currentManufacturers = getValues('selectedManufacturers');
      setValue('selectedManufacturers', isChecked ? [...currentManufacturers, id] : currentManufacturers.filter(item => item !== id));
    } else if (type === 'ratings') {
      const currentRatings = getValues('selectedRatings');
      setValue('selectedRatings', isChecked ? [...currentRatings, id] : currentRatings.filter(item => item !== id));
    }
  };

  const accordionItems: AccordionItemData[] = [
    {
      id: 'category',
      title: 'Category', 
      content: (
        <div className="flex flex-col  space-y-2">
          {productCategories.map(category => (
            <div
              key={category.id}
              className={`cursor-pointer text-sm py-1 px-2 rounded-md ${selectedCategory?.id === category.id
                ? 'text-[#1c1c1c] font-semibold' // Active category styling
                : 'text-gray-600 hover:text-[#1c1c1c]' // Inactive category styling
                }`}
              onClick={() => handleCategorySelect(category)}
            >
              {category.name}
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'brands',
      title: 'Brands',
      content: selectedCategory ? (
        <CheckboxGroupList
          type="brand"
          values={watchedBrands}
          items={selectedCategory.brands}
          onChange={handleCheckboxChange}
        />
      ) : (
        <p className="text-sm text-gray-500">Please select a category to see manufacturers.</p>
      ),
    },
    {
      id: 'features',
      title: 'Features',
      content: selectedCategory ? (
        <CheckboxGroupList
          type="feature"
          values={watchedFeatures}
          items={selectedCategory.features}
          onChange={handleCheckboxChange}
        />
      ) : (
        <p className="text-sm text-gray-500">Please select a category to see manufacturers.</p>
      ),
    },
    {
      id: 'manufacturers',
      title: 'Manufacturers',
      content: selectedCategory ? (
        <CheckboxGroupList
          type="manufacturer"
          values={watchedManufacturers}
          items={selectedCategory.manufacturers}
          onChange={handleCheckboxChange}
        />
      ) : (
        <p className="text-sm text-gray-500">Please select a category to see manufacturers.</p>
      ),
    },
    {
      id: 'ratings',
      title: 'Ratings',
      content: (
        <div className="flex flex-col space-y-2">
          {
            ratingFilter.map(rating => (
              <div key={rating.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating.id}`}
                  className='data-[state=checked]:bg-[#0d6efd] data-[state=checked]:border-none'
                  checked={watchedRatings.includes(rating.value)}
                  onCheckedChange={(isChecked) => handleCheckboxChange(rating.value, 'ratings', isChecked)}
                />
                <Label htmlFor={`brand-${rating.id}`} className='text-sm text-[#ff9017] mt-1'>
                  <Rating defaultValue={rating.value}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <RatingButton key={index} />
                    ))}
                  </Rating>
                </Label>
              </div>
            ))
          }
        </div>
      ),
    },
    {
      id: 'condition',
      title: 'Condition',
      content: (
        <div className="flex flex-col">
          {
            <>
              <div className='flex items-center space-x-2'>


                <RadioGroup
                  onValueChange={(value) => setValue("condition", value)}
                  value={watch("condition")}
                >

                  {
                    conditionFilter.map(
                      (currentValue, index) => (
                        <div className='flex flex-row justify-start space-x-4' key={index}>
                          <RadioGroupItem value={currentValue.value} id={currentValue.value} className='mt-0.5' />
                          <Label htmlFor={currentValue.value}>
                            {currentValue.label}
                          </Label>
                        </div>
                      )
                    )
                  }

                </RadioGroup>
              </div>
            </>
          }
        </div>
      ),
    },
    {
      id: 'price',
      title: 'Price range',
      content: (
        <div className="flex flex-col">
          {
            <PriceRangeFilter setValue={setValue} watch={watch} />
          }
        </div>
      ),
    },
  ];

  const onSubmit = (data: FormData) => {
    const formData = {
      category: data.category || 0,
      selectedBrands: data.selectedBrands.length ? data.selectedBrands : 0,
      selectedFeatures: data.selectedFeatures.length ? data.selectedFeatures : 0,
      selectedManufacturers: data.selectedManufacturers.length ? data.selectedManufacturers : 0,
      selectedRatings: data.selectedRatings, 
      condition: data.condition,
      minPrice: data.minPrice,
      maxPrice: data.maxPrice,
    };
    onFilterChange(formData as any);
    console.log("📦 Final Form Data:", formData);
  };


  return (
    <div className="text-sm border border-[#dee2ef] rounded-[5] pb-3 bg-white">
      {accordionItems.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={openItemIds.includes(item.id)}
          onToggle={handleToggle}
          isLast={index === accordionItems.length - 1}
          />
      ))}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Button
          type="submit"
          className="m-4 w-[90%] p-2 rounded-[5] bg-white text-[#0A74FF] border-1 border-[#DEE2E7] hover:tracking-wide transition-all duration-300 ease-in-out  hover:cursor-pointer hover:text-[#606060] hover:bg-[#f7fafc]"
          variant="default"
        >
          Apply
        </Button>
      </form>

    </div>
  );
};

export default Filters;










