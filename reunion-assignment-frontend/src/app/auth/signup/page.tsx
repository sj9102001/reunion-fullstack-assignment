/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast";
import useAuthRedirect from "@/hooks/useAuthRedirect";

interface SignupFormInputs {
    email: string
    password: string
    confirmPassword: string,
}

const SignupPage = () => {
    useAuthRedirect();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormInputs>()
    const router = useRouter()
    const { toast } = useToast();
    const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
        const { email, password, confirmPassword } = data

        if (password !== confirmPassword) {
            toast({
                title: "Password and Confirm password should match",
                variant: "destructive"
            })
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json();
            if (res.ok) {
                toast({
                    title: "Signed up successfully",
                    description: "Please log in",
                    variant: "default"
                })
                router.push("/auth/login")
            } else {
                throw new Error(data.message);
            }
        } catch (error: any) {
            toast({
                title: "Signup Failed",
                description: "Please try again",
                variant: "destructive"
            })
        }
    }

    return (
        <main className="flex h-screen w-full items-center bg-sidebar justify-center px-4">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Signup</CardTitle>
                    <CardDescription>
                        Enter your email below to create a new account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email", { required: "Email is required" })}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...register("confirmPassword", { required: "Confirm Password is required" })}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Signing up..." : "Signup"}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="underline">
                            Log in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}

export default SignupPage