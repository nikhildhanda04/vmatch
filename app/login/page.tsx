"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { GraduationCap, Sparkles, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/"
      });
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row font-sans selection:bg-orange-500/30">
      
      {/* Left Side - Brand & Graphics */}
      <div className="flex-1 relative flex flex-col justify-between p-8 md:p-12 lg:p-16 border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        
        {/* Logo */}
        <div className="flex items-center gap-2 z-10">
          <Sparkles className="w-8 h-8 text-orange-500" />
          <span className="text-2xl font-bold tracking-tight">Vmatch.</span>
        </div>

        {/* Hero Text */}
        <div className="mt-20 md:mt-0 z-10 max-w-lg">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6 leading-[1.1]">
            Find your match on <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">campus.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 font-medium">
            Exclusive dating for VIT Bhopal students. Connect, date, and build relationships with people you see every day.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="hidden md:flex gap-6 mt-12 z-10">
          <div className="flex items-center gap-2 text-neutral-400">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium">100% Verified Students</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <GraduationCap className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium">VIT Bhopal Exclusive</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 lg:p-16 relative bg-neutral-950">
        <div className="w-full max-w-md space-y-8 relative z-10">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-neutral-400">Sign in to your account with your college email.</p>
          </div>

          <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative flex items-center justify-center gap-3 w-full bg-black border border-white/10 text-white px-8 py-4 rounded-2xl text-lg font-medium transition-all hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </div>
            </button>

            <div className="mt-6">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-amber-500/90 text-sm font-medium flex gap-2">
                  <span className="shrink-0">⚠️</span>
                  <span>You MUST use your <b>@vitbhopal.ac.in</b> email ID. Logging in with a standard Gmail account is strictly prohibited and will be rejected.</span>
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-neutral-500 px-8">
            By signing in, you agree to our Terms of Service and Privacy Policy. You also understand that Vmatch is exclusively for VIT Bhopal students.
          </p>

        </div>
      </div>
    </div>
  );
}
