"use client"
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface IFormInput {
  itemName: string;
  itemDetails: string;
  quantity: number;
  unit: string;
}

export default function InquiryForm(){
  const { register, handleSubmit, control, formState: { errors } } = useForm<IFormInput>();
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    setMessage('Inquiry sent successfully! Check console for data.');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="bg-white rounded-[5] pt-4 pb-4 pl-6 pr-6 flex flex-col space-y-6">
      <h2 className='font-semibold text-xl text-[#1c1c1c]'>Send quote to suppliers</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <Input
            type="text"
            placeholder={errors.itemName ? errors.itemName.message : "What item you need?"}
            {...register('itemName', { required: 'Item name is required' })}
          />
          {
            errors.itemName ? <p className="text-sm text-red-600 mt-1">{errors.itemName.message}</p> : <p className="text-sm text-white mt-1">HIIII</p>
          }
          {/* <p className="text-sm text-red-600 mt-1">{errors.itemName.message}</p> */}
          
        </div>

        <div>
          <Textarea
            placeholder="Type more details"
            {...register('itemDetails', { required: 'Details are required' })}
          />
          {
            errors.itemDetails ? <p className="text-sm text-red-600 mt-1">{errors.itemDetails.message}</p> : <p className="text-sm text-white mt-1">HIIII</p>
          }
        </div>

        <div className='w-full grid grid-cols-[2fr_1fr_1fr] gap-x-5'>
          <div>
            <Input
              type="number"
              placeholder="Quantity"
              {...register('quantity', {
                required: 'Quantity is required',
                min: { value: 1, message: 'Quantity must be at least 1' },
                valueAsNumber: true,
              })}
            />
            {errors.quantity ? 
              <p className="text-sm text-red-600 mt-1">{errors.quantity.message}</p> : <p className="text-sm text-white mt-1">HIIII</p>
            }
            
          </div>

          <Controller
            name="unit"
            control={control}
            rules={{ required: 'Unit is required' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Pcs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Units</SelectLabel>
                    <SelectItem value="Pcs">Pcs</SelectItem>
                    <SelectItem value="Kg">Kg</SelectItem>
                    <SelectItem value="Meters">Meters</SelectItem>
                    <SelectItem value="Units">Units</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.unit ?
            <p className="text-sm text-red-600 mt-1">{errors.unit.message}</p> : <p className="text-sm text-white mt-1">HIIII</p>
          }
          
        </div>

        <div className='w-full grid grid-cols-[1fr_1fr_1fr]'>
          <Button
            type="submit"
            className="p-2 rounded-[5] bg-[#0A74FF] text-white border-1 border-[#DEE2E7] hover:tracking-wide transition-all duration-300 ease-in-out hover:cursor-pointer"
            variant="default"
          >
            Send Inquiry
          </Button>
        </div>
      </form>

      {message && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-center">
          {message}
        </div>
      )}
    </div>
  );
};

