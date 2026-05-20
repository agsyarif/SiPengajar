"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { FadeInStagger, FadeInItem } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});
type FormValues = z.infer<typeof schema>;

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [errorKey, setErrorKey] = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function handleGoogle() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  async function onSubmit(data: FormValues) {
    setError("");
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (res?.error) {
      setError("Email atau password salah.");
      setErrorKey((k) => k + 1);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <AuthShell>
      <div className="mb-7">
        <h1 className="font-display text-xl font-bold text-stone-900 mb-1">
          Masuk ke SiPengajar
        </h1>
        <p className="text-sm text-stone-500">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-teal-600 hover:text-teal-800 font-medium"
          >
            Daftar gratis
          </Link>
        </p>
      </div>

      {/* Google OAuth */}
      <button
        onClick={handleGoogle}
        disabled={googleLoading}
        className="w-full h-10 flex items-center justify-center gap-2.5 rounded-md border border-stone-200 bg-white text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-50 mb-5"
      >
        {googleLoading ? (
          <span className="w-4 h-4 rounded-full border-2 border-stone-300 border-t-stone-700 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        Lanjutkan dengan Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-stone-200" />
        <span className="text-2xs text-stone-400">atau dengan email</span>
        <div className="flex-1 h-px bg-stone-200" />
      </div>

      {/* Form */}
      <motion.div
        key={errorKey}
        animate={errorKey > 0 ? { x: [0, -8, 8, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FadeInStagger staggerDelay={0.05}>
            <FadeInItem>
              <div className="mb-3">
                <label className="text-xs font-medium text-stone-700 mb-1.5 block">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="kamu@sekolah.sch.id"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-2xs text-danger-bold mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </FadeInItem>

            <FadeInItem>
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-stone-700">
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-2xs text-teal-600 hover:text-teal-800"
                  >
                    Lupa password?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-2xs text-danger-bold mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </FadeInItem>

            <FadeInItem>
              {error && (
                <p className="text-xs text-danger-bold mb-3 text-center">
                  {error}
                </p>
              )}
              <Button type="submit" loading={isSubmitting} className="w-full">
                Masuk
              </Button>
            </FadeInItem>
          </FadeInStagger>
        </form>
      </motion.div>
    </AuthShell>
  );
}
