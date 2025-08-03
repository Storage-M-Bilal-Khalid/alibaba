"use client"
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

interface FormData {
    verify: boolean;
    fruit: string;
}

export default function NavForm() {
    const { handleSubmit, control, formState: { errors }, trigger } = useForm<FormData>({
        defaultValues: {
            verify: false,
            fruit: '',
        },
        mode: "onChange", 
    });

    const onSubmit: SubmitHandler<FormData> = (data) => {
        alert(`Form data submitted automatically (or manually): ${data}`)
        console.log("Form data submitted automatically (or manually):", data);
    };

    const handleSelectChange = async (value: string, fieldOnChange: (...event: any[]) => void) => {
        fieldOnChange(value);
        await trigger("fruit");
        handleSubmit(onSubmit)();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex space-x-5'>
            <div className='flex items-center space-x-2'>
                <Controller<FormData, "verify">
                    name="verify"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                        <Checkbox
                            id="verify"
                            className='data-[state=checked]:bg-[#0d6efd] data-[state=checked]:border-none'
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />
                <Label htmlFor="verify" className='text-sm'>Verified only</Label>
                {errors.verify && <span className="text-red-500 text-xs">{errors.verify.message}</span>}
            </div>

            <Controller<FormData, "fruit">
                name="fruit"
                control={control}
                rules={{ required: "Please select a fruit." }}
                render={({ field }) => (
                    <Select
                        // Call your custom handler which then updates state AND submits
                        onValueChange={(value) => handleSelectChange(value, field.onChange)}
                        value={field.value}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Featured" className='data-[placeholder]:text-black' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Fruits</SelectLabel>
                                <SelectItem value="apple">Apple</SelectItem>
                                <SelectItem value="banana">Banana</SelectItem>
                                <SelectItem value="blueberry">Blueberry</SelectItem>
                                <SelectItem value="grapes">Grapes</SelectItem>
                                <SelectItem value="pineapple">Pineapple</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
            />
            {errors.fruit && <span className="text-red-500 text-xs">{errors.fruit.message}</span>}
        </form>
    );
}