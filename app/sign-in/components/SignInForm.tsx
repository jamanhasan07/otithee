"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Hotel, KeyRound, ShieldCheck, Eye, EyeOff } from "lucide-react";

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

export default function SignInForm() {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { email: "", password: "" },
  });
  const { errors } = formState;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: FormValues) => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (
        data.email === "demo@otithee.com" &&
        data.password === "password123"
      ) {
        toast("Login successful");
        router.push("/dashboard");
      } else {
        toast("Login failed");
      }
    }, 900);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 text-slate-900">
      {/* Blue radial glow */}
      <div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(circle_at_top,_#60a5fa55,_transparent_70%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="mx-auto grid w-full max-w-5xl gap-8 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_24px_80px_rgba(30,58,138,0.12)] md:grid-cols-[1.2fr_minmax(0,1fr)] md:p-10">
          {/* Brand section */}
          <div className="flex flex-col justify-between gap-10 rounded-2xl bg-blue-50/60 p-6">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Hotel className="h-3 w-3" />
                </span>
                Otithee Integrated Hospitality Suite
              </div>

              <div className="space-y-3">
                <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Welcome back,
                  <span className="block text-blue-600">Otithee Partner</span>
                </h1>
                <p className="max-w-md text-sm text-slate-600 sm:text-base leading-relaxed">
                  Sign in to manage your properties, reservations,
                  transportation and accounting — all from a unified ERP built
                  for hospitality teams.
                </p>
              </div>

              <dl className="grid gap-4 text-sm text-slate-700 sm:grid-cols-3">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 rounded-full bg-blue-100 p-1 text-blue-600">
                    <KeyRound className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <dt className="font-medium">Single sign-on</dt>
                    <dd className="text-xs text-slate-500 mt-1">
                      All modules accessible in one platform.
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-0.5 rounded-full bg-blue-100 p-1 text-blue-600">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <dt className="font-medium">Enterprise security</dt>
                    <dd className="text-xs text-slate-500 mt-1">
                      Role-based access and audit logs.
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-0.5 rounded-full bg-blue-100 p-1">
                    🏨
                  </span>
                  <div>
                    <dt className="font-medium">Hotel-focused</dt>
                    <dd className="text-xs text-slate-500 mt-1">
                      Optimized for real hospitality workflows.
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="hidden text-xs text-slate-400 md:block">
              © {new Date().getFullYear()} Otithee. All rights reserved.
            </div>
          </div>

          {/* Login Form */}
          <Card className="border border-slate-200 bg-white shadow-md rounded-2xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl font-semibold tracking-tight">
                Sign in to Otithee
              </CardTitle>
              <p className="text-sm text-slate-500">
                Use your work email to access your ERP dashboard.
              </p>
            </CardHeader>

            <CardContent>
              <form
                id="signin-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@hotelgroup.com"
                    className="bg-white"
                    autoComplete="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Enter a valid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password with show/hide icon */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a
                      className="text-xs font-medium text-blue-600 hover:text-blue-500 hover:underline"
                      href="/forgot-password"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Your password"
                      className="bg-white pr-10"
                      autoComplete="current-password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2 pt-1">
                  <Checkbox id="remember" {...register("remember")} />
                  <Label
                    htmlFor="remember"
                    className="cursor-pointer text-xs text-slate-500"
                  >
                    Keep me signed in
                  </Label>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 border-t border-slate-200 bg-blue-50/40 pt-4 rounded-b-2xl">
              <Button
                form="signin-form"
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-500"
              >
                {loading ? "Signing you in…" : "Sign in"}
              </Button>

              <div className="w-full rounded-lg border border-dashed border-blue-300 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                <p className="font-medium">Demo access</p>
                <p className="mt-1">
                  Email: <span className="font-mono">demo@otithee.com</span>
                  <br />
                  Password: <span className="font-mono">password123</span>
                </p>
              </div>

              <p className="text-center text-[11px] text-slate-400 md:hidden">
                © {new Date().getFullYear()} Otithee. All rights reserved.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
