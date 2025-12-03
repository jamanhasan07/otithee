"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type FormValues = {
  email: string;
  password: string;
  remember?: boolean;
};

const DEMO_EMAIL = "demo@otithee.com";
const DEMO_PASSWORD = "password123";

export default function SignInForm() {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { email: "", password: "" },
  });
  const { errors } = formState;
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const onSubmit = (data: FormValues) => {
    setLoading(true);

    // Mock network delay
    setTimeout(() => {
      setLoading(false);

      // Demo credential check
      if (data.email === DEMO_EMAIL && data.password === DEMO_PASSWORD) {
        toast("Login successful");
        router.push("/dashboard");
      } else {
        toast("Login failed");
      }
    }, 900);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to Otithee</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            id="signin-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" {...register("remember")} />
                <Label htmlFor="remember" className="cursor-pointer">
                  Remember me
                </Label>
              </div>

              <a className="text-sm hover:underline" href="/forgot-password">
                Forgot?
              </a>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            form="signin-form"
            type="submit"
            onClick={() => {}}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Demo account: <strong>demo@otithee.com</strong> /{" "}
            <strong>password123</strong>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
