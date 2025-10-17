"use client";
import Link from "next/link";
import { loginSchema } from "../../lib/validation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const result = loginSchema.shape?.email?.safeParse(value);
    setError((prev) => ({
      ...prev,
      email: result.success ? undefined : result.error.errors?.[0].message,
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const result = loginSchema.shape?.password?.safeParse(value);
    setError((prev) => ({
      ...prev,
      password: result?.success
        ? undefined
        : result?.error?.errors?.[0]?.message,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ email, password });
    setLoading(true);
    setMessage("");

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setError({
        email: fieldErrors?.email?.[0],
        password: fieldErrors.password?.[0],
      });
      toast.error("Please fix the validation errors!");
      setLoading(false);
      return;
    }

    const { data, error: supabaseError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (supabaseError) {
      setMessage(supabaseError.message);
      toast.error(`${supabaseError.message}`);
    } else {
      toast.success("Login successful!");
      setError({});
      setEmail("");
      setPassword("");

      setTimeout(() => {
        router.push("/createtodo");
      }, 1500);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back
        </h1>
        <p className="text-center text-white/70 mb-8">
          Login to manage your tasks efficiently 🚀
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            name="email"
            placeholder="Email"
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
            {loading ? "Logging in..." : "Login"}
          </button>

       
        </form>

        <p className="text-center text-white/70 mt-6 text-sm">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-white font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
