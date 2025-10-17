"use client";
import { signUpSchema } from "@/lib/validation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleFullNameChange = (e) => {
    const value = e.target.value;
    setFullname(value);

    const result = signUpSchema.shape?.fullname?.safeParse(value);
    setError((prev) => ({
      ...prev,
      fullname: result?.success
        ? undefined
        : result?.error?.errors?.[0]?.message,
    }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const result = signUpSchema.shape?.email?.safeParse(value);
    setError((prev) => ({
      ...prev,
      email: result.success ? undefined : result.error.errors?.[0].message,
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const result = signUpSchema.shape?.password?.safeParse(value);
    setError((prev) => ({
      ...prev,
      password: result.success
        ? undefined
        : result?.error?.errors?.[0]?.message,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = signUpSchema?.safeParse({ fullname, email, password });
    setLoading(true);

    if (!result.success) {
      const fieldErrors = result?.error?.flatten()?.fieldErrors;
      setError({
        fullname: fieldErrors?.fullname?.[0],
        email: fieldErrors?.email?.[0],
        password: fieldErrors.password?.[0],
      });
      setLoading(false);
      toast.error("Please fix the validation errors!");
      return;
    }

    setError({});

    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { fullname } },
    });

    setLoading(false);

    if (supabaseError) {
      console.log("Signup error:", supabaseError);
      toast.error(supabaseError.message);
    } else {
      toast.success("Signup successful! Redirecting...");
      setEmail("");
      setPassword("");
      setFullname("");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h1>
        <p className="text-center text-white/70 mb-8">
          Join us and start organizing your tasks today ✨
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={handleFullNameChange}
            name="fullname"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
          {error?.fullname && (
            <p className="text-red-500 text-sm mt-1">{error?.fullname}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            name="email"
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
          {error?.email && (
            <p className="text-red-500 text-sm mt-1">{error?.email}</p>
          )}

          <div className="w-full flex items-center px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 focus-within:ring-2 focus-within:ring-white/40">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              name="password"
              placeholder="Password"
              className="w-full bg-transparent outline-none placeholder-white/60 text-white"
            />
            <button
              type="button"
              className="ml-2 text-white/70 hover:text-white transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {error?.password && (
            <p className="text-red-500 text-sm mt-1">{error?.password}</p>
          )}

          <button
            type="submit"
            className="w-full mt-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-white/70 mt-6 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-white font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </main>
  );
}
