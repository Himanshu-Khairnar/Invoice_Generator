"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/services/auth.service";

const oauthErrors: Record<string, string> = {
  oauth_denied: "Google sign-in was cancelled.",
  oauth_state_mismatch: "Security check failed. Please try again.",
  oauth_token_failed: "Could not complete Google sign-in. Please try again.",
  oauth_profile_failed: "Could not fetch your Google profile. Please try again.",
  oauth_no_email: "Your Google account did not provide an email address.",
  oauth_invalid: "Invalid OAuth request. Please try again.",
};

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

type SignupForm = z.infer<typeof schema>;

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpStep, setOtpStep] = useState<"email" | "code">("email");
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    const userData = await login({ email: data.email, password: data.password });
    console.log(userData.data);
    router.push("/homepage");
    setIsLoading(false);
  };

  const handleSendOtp = async () => {
    if (!otpEmail) { setOtpError("Please enter your email."); return; }
    setOtpLoading(true); setOtpError("");
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setOtpError(data.error || "Failed to send code."); return; }
      setOtpStep("code");
    } finally { setOtpLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) { setOtpError("Please enter the 6-digit code."); return; }
    setOtpLoading(true); setOtpError("");
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) { setOtpError(data.error || "Invalid code."); return; }
      router.push("/homepage");
    } finally { setOtpLoading(false); }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-20 bg-background" />
      <div className="fixed inset-0 -z-10 [background-image:radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,#000_50%,transparent_100%)]" />
      <div className="fixed top-[-15%] left-1/2 -translate-x-1/2 -z-10 h-[500px] w-[600px] rounded-full bg-primary/15 blur-[120px] opacity-70 pointer-events-none" />

      {/* Top nav */}
      <div className="flex items-center justify-start px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <img src="/invoice-logo.svg" alt="BillPartner" className="h-6 w-6" />
          <span className="text-sm font-bold tracking-tight">BillPartner</span>
        </Link>
      </div>

      {/* Main centered form */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-[400px]">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border/50 bg-background shadow-sm mb-5">
              <img src="/invoice-logo.svg" alt="BillPartner" className="h-7 w-7" />
            </div>
            {!otpMode ? (
              <>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">Sign in to your BillPartner account</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {otpStep === "email" ? "Sign in with email" : "Check your inbox"}
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {otpStep === "email"
                    ? "We'll send a one-time code to your email"
                    : `Code sent to ${otpEmail}`}
                </p>
              </>
            )}
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-lg p-6 space-y-5">

            {/* OAuth error */}
            {oauthError && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive">
                {oauthErrors[oauthError] ?? "An error occurred. Please try again."}
              </div>
            )}

            {!otpMode ? (
              <>
                {/* Social buttons */}
                <div className="space-y-2.5">
                  <Button
                    variant="outline"
                    className="w-full h-10 font-medium border-border/60 bg-background/80 hover:bg-muted/50 transition-all"
                    type="button"
                    onClick={() => (window.location.href = "/api/auth/google")}
                  >
                    <GoogleIcon className="mr-2.5 h-4 w-4" />
                    Continue with Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-10 font-medium border-border/60 bg-background/80 hover:bg-muted/50 transition-all"
                    type="button"
                    onClick={() => { setOtpMode(true); setOtpStep("email"); setOtpError(""); }}
                  >
                    <Mail className="mr-2.5 h-4 w-4 text-muted-foreground" />
                    Continue with Email OTP
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/40" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-3 text-muted-foreground">or sign in with password</span>
                  </div>
                </div>

                {/* Email/password form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      {...register("email")}
                      className={`h-10 bg-background/80 ${errors.email ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...register("password")}
                        className={`h-10 bg-background/80 pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 font-semibold shadow-sm shadow-primary/20 transition-all hover:-translate-y-px"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign in
                  </Button>
                </form>
              </>
            ) : (
              /* OTP Flow */
              <div className="space-y-4">
                {otpStep === "email" ? (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="otp-email" className="text-sm font-medium">Email address</Label>
                      <Input
                        id="otp-email"
                        type="email"
                        placeholder="you@company.com"
                        value={otpEmail}
                        onChange={(e) => setOtpEmail(e.target.value)}
                        className="h-10 bg-background/80"
                      />
                    </div>
                    {otpError && <p className="text-xs text-destructive">{otpError}</p>}
                    <Button className="w-full h-10 font-semibold" onClick={handleSendOtp} disabled={otpLoading}>
                      {otpLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send verification code
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <Input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        className="text-center text-2xl font-bold tracking-[0.5em] h-14 bg-background/80"
                      />
                      <div className="flex justify-center">
                        <button
                          onClick={() => { setOtpStep("email"); setOtpCode(""); setOtpError(""); }}
                          className="text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          Resend code or change email
                        </button>
                      </div>
                    </div>
                    {otpError && <p className="text-xs text-destructive text-center">{otpError}</p>}
                    <Button
                      className="w-full h-10 font-semibold"
                      onClick={handleVerifyOtp}
                      disabled={otpLoading || otpCode.length !== 6}
                    >
                      {otpLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Verify & sign in
                    </Button>
                  </>
                )}

                <button
                  onClick={() => { setOtpMode(false); setOtpStep("email"); setOtpCode(""); setOtpError(""); }}
                  className="flex items-center justify-center gap-1.5 w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" /> Back to all sign in options
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-foreground hover:text-primary transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
