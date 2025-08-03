"use client"
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon, ChevronRightIcon, Eye, EyeOff, LoaderCircle, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { Icons } from "@/components/Icon";
import { cn } from "@/lib/utils";
import { errorNotifier, successNotifier } from "@/lib/designPatterns/notificationTrigger";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";

export default function AuthCard() {
    const [isLogin, setIsLogin] = useState(true);
    const formRef = useRef<{ resetForm: () => void }>(null);



    const toggleForm = () => {
        setIsLogin(!isLogin);
        setTimeout(() => {
            formRef.current?.resetForm(); // reset after state change
        }, 0);
    };

    return (
        <div className="max-h-[94vh] min-h-[94vh] w-full bg-white rounded-[10] shadow-md flex relative transition-all duration-700 ease-in-out p-5 my-5">
            <Link className={cn("bg-[#117dff] rounded-full w-8 h-8 absolute flex items-center justify-center top-5", isLogin ? " right-5" : "left-5")} href="/">
                <X className="w-4 h-4 text-white" />
            </Link>
            {/* Left Side */}
            <div className={`w-1/2 py-2 px-15 flex flex-col items-center justify-center bg-[#f7fafc] text-[#505050] ${isLogin ? ' rounded-tl-[10] rounded-bl-[10]' : 'order-2 rounded-tr-[10] rounded-br-[10] '}`}>
                <div className="flex flex-col items-center justify-center space-y-10">

                    <Icons.logo className="w-20 h-20" />

                    <p className="text-sm">
                        {
                            isLogin
                                ?
                                "Welcome back! Your security and privacy are our top priorities. Sign in to safely access your account. We've implemented robust measures to protect your data, ensuring a secure and private experience every time you return. Feel confident knowing your information is in good hands"
                                :
                                "Join our community with confidence! Your security and privacy are fundamental to us. By signing up, you're not just creating an account; you're gaining access to a platform built with robust measures to protect your personal data. We are committed to ensuring a secure and private experience from your very first click. Get started today, knowing your information is safe with us."
                        }
                    </p>
                    <Link className="text-white px-5 py-2 rounded bg-[#117dff]" href="/">
                        Go to HomePage
                    </Link>
                </div>
            </div>

            {/* Switch Button */}
            <Button
                onClick={toggleForm}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer z-10 bg-[#117dff]"
            >
                <span className="text-2xl font-bold">
                    {
                        isLogin
                            ?
                            <ChevronLeftIcon className="w-4 h-4" />
                            :
                            <ChevronRightIcon className="w-4 h-4" />
                    }
                </span>
            </Button>

            {/* Right Side Form */}
            <div className={`flex flex-col justify-center w-1/2 py-2 px-10  ${isLogin ? '' : 'order-1'}`}>
                <h2 className="text-5xl font-bold mb-6 text-[#117dff] text-center ">
                    {isLogin ? "Welcome Back!" : "Join Us Today!"}
                </h2>
                <p className="mb-6 text-sm text-[#505050] text-center">
                    {isLogin ? "Sign in to continue" : "Create your account"}
                </p>
                {
                    isLogin
                        ?
                        <SignInForm />
                        :
                        <SignUpForm />
                }
                <p className="mt-6 text-sm text-center text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={toggleForm}
                        className="ml-1 text-blue-600 font-medium hover:underline"
                    >
                        {isLogin ? "Register" : "Login"}
                    </button>
                </p>
            </div>
        </div>

    );
}

function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const signUpSchema = z.object({
        name: z.string().min(2, {
            message: 'Name must be at least 2 characters.',
        }),
        email: z.string().email({
            message: 'Please enter a valid email address.',
        }),
        password: z.string()
            .min(8, {
                message: 'Password must be exactly 8 characters.',
            })
            .max(8, {
                message: 'Password must be exactly 8 characters.',
            })
            .regex(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8}$/), {
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            }),
        confirmPassword: z.string(),
        role: z.enum(['customer', 'seller', 'hybrid'], {
            message: "Please select a valid role (customer or seller).",
        }),
    }).refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'customer',
        },
    });

    const { formState: { isValid } } = form;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
        try {
            // Send data to your backend API endpoint
            const response = await fetch('/api/auth/register', { // Updated route path
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to sign up.');
            }

            // If sign-up is successful
            console.log('Sign Up Data:', values);
            alert("Account has been created successfully");
            form.reset();
            setIsSubmitting(false);
        } catch (error: any) {
            console.error('Sign Up Error:', error);
            errorNotifier.notify(error)
        } finally {

        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between">
                                <FormLabel className="text-[#606060]">Name</FormLabel>
                                <FormMessage className="text-red-500" />
                            </div>
                            <FormControl>
                                <Input
                                    placeholder="Enter your name"
                                    {...field}
                                    className="bg-white text-[#606060] border-[#dee2e7] rounded-[5]"
                                />
                            </FormControl>
                            <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between">
                                <FormLabel className="text-[#606060]">Email</FormLabel>
                                <FormMessage className="text-red-500" />
                            </div>
                            <FormControl>
                                <Input
                                    placeholder="Enter your email"
                                    {...field}
                                    type="email"
                                    className="bg-white text-[#606060] border-[#dee2e7] rounded-[5]"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between">
                                <FormLabel className="text-[#606060]">Password</FormLabel>
                                <FormMessage className="text-red-500" />
                            </div>
                            <FormControl>
                                <div className='relative'>
                                    <Input
                                        placeholder="Enter your password"
                                        {...field}
                                        type={showPassword ? 'text' : 'password'}
                                        className="bg-white text-[#606060] border-[#dee2e7] rounded-[5]"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#606060]"
                                        title={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <Eye className="h-5 w-5" />
                                        ) : (
                                            <EyeOff className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between">
                                <FormLabel className="text-[#606060]">Confirm Password</FormLabel>
                                <FormMessage className="text-red-500" />
                            </div>
                            <FormControl>
                                <div className='relative'>
                                    <Input
                                        placeholder="Confirm your password"
                                        {...field}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="bg-white text-[#606060] border-[#dee2e7] rounded-[5]"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#606060]"
                                        title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                    >
                                        {showConfirmPassword ? (
                                            <Eye className="h-5 w-5 text-[#606060]" />
                                        ) : (
                                            <EyeOff className="h-5 w-5 text-[#606060]" />
                                        )}
                                    </button>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className="text-gray-700">Role</FormLabel>
                            <FormMessage className="text-red-500" />
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger
                                        className="bg-white text-gray-900 border-[#dee2e7]"
                                    >
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent
                                    className="bg-white border-gray-300"
                                >
                                    <SelectItem
                                        value="customer"
                                        className="hover:bg-gray-100 text-gray-900"
                                    >
                                        Customer
                                    </SelectItem>
                                    <SelectItem
                                        value="seller"
                                        className="hover:bg-gray-100 text-gray-900"
                                    >
                                        Seller
                                    </SelectItem>
                                    <SelectItem
                                        value="hybrid"
                                        className="hover:bg-gray-100 text-gray-900"
                                    >
                                        Hybrid Seller and Customer
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full text-white rounded py-2 bg-[#117dff] hover:underline hover:tracking-wide transition-all duration-300 ease-in-out cursor-pinter"
                    disabled={!isValid}
                >
                    {
                        isSubmitting
                            ?
                            <LoaderCircle className="w-4 h-4 text-white animate-spin" />
                            :
                            null
                    }
                    Register
                </Button>
            </form>
        </Form>
    );
}


function SignInForm() {
    const router = useRouter();
    const { setAuth } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [userId, setUserId] = useState<number>();
    const [userRole, setUserRole] = useState<string | null>(null);
    const signInSchema = z.object({
        email: z.string().email({
            message: 'Please enter a valid email address.',
        }),
        password: z.string().min(8, {
            message: 'Password must be at least 8 characters.',
        }).max(8, {
            message: 'Password must be exactly 8 characters'
        }),
    });
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const { formState: { isValid } } = form;
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


const onSubmit = async (values: z.infer<typeof signInSchema>) => {
  setIsSubmitting(true);
  try {
    const response = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    const responseData = await response.json();

    if (!response.ok || responseData.status === 403) {
      alert(responseData.message || 'Failed to sign in.');
      errorNotifier.notify(responseData.message);
      setIsSubmitting(false);
      return;
    }

    // ✅ Set AuthContext (so UI re-renders)
    setAuth(responseData.user.user_id, responseData.user.role);

    setLoginSuccess(true);
    setIsSubmitting(false);
    alert("LogIn successful");

    router.push(`/dashboard`);
  } catch (error: any) {
    console.error('Sign In Error:', error);
    setIsSubmitting(false);
    alert("LogIn failed");
  }
};

    // const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    //     setIsSubmitting(true);
    //     try {
    //         const response = await fetch('/api/auth/sign-in', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(values),
    //         });
    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(errorData.message || 'Failed to sign in.');
    //         }
    //         const responseData = await response.json();
    //         console.log('Sign In Data:', responseData);
    //         if (responseData.status === 403) {
    //             alert(responseData.message);
    //             setIsSubmitting(false);
    //             errorNotifier.notify(responseData.message);
    //         } else {
    //             setUserRole(responseData.user.role);
    //             setUserId(responseData.user.user_id);
    //             setLoginSuccess(true);
    //             setIsSubmitting(false);
    //             alert("LogIn successfull");
    //             router.push(`/dashboard`);
    //         }
    //     } catch (error: any) {
    //         console.error('Sign In Error:', error);
    //         setIsSubmitting(false);
    //         alert("LogIn failed")
    //     }
    // };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between">
                                <FormLabel className="text-[#606060]">Email</FormLabel>
                                <FormMessage className="text-red-500" />
                            </div>
                            <FormControl>
                                <Input
                                    placeholder="Enter your email"
                                    {...field}
                                    type="email"
                                    className="bg-white text-[#606060] border-[#dee2e7] rounded-[5]"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between">
                                <FormLabel className="text-[#606060]">Password</FormLabel>
                                <FormMessage className="text-red-500" />
                            </div>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder="Enter your password"
                                        {...field}
                                        type={showPassword ? 'text' : 'password'}
                                        className="bg-white text-[#606060] border-[#dee2e7] rounded-[5]"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#606060]"
                                        title={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <Eye className="h-5 w-5 text-[#606060]" />
                                        ) : (
                                            <EyeOff className="h-5 w-5 text-[#606060]" />
                                        )}
                                    </button>
                                </div>
                            </FormControl>
                            <Link href="/forgot-password" className="text-right text-blue-500 hover:underline text-sm">
                                Forgot Password
                            </Link>
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full text-white rounded py-2 bg-[#117dff] hover:underline hover:tracking-wide transition-all duration-300 ease-in-out cursor-pinter"
                    disabled={!isValid}
                >
                    {
                        isSubmitting
                            ?
                            <LoaderCircle className="w-4 h-4 text-white animate-spin" />
                            :
                            null
                    }
                    Sign in
                </Button>
            </form>
        </Form>
    )
}

