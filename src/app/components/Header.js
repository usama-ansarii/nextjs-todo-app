"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { LogIn, LogOut } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // 🔹 Fetch current user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();

    // 🔹 Listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🔹 Handle Logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed!");
    } else {
      toast.success("Logged out successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full px-8 py-4 flex items-center justify-between bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg z-50">
  {/* Left side: Logo / Title */}
  <div className="flex items-center">
    <h1 className="text-2xl font-bold text-white tracking-wide">TODO</h1>
  </div>

  {/* Right side: Login or Logout Button */}
  <div className="ml-auto">
    {user ? (
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition font-semibold text-white shadow-md cursor-pointer"
      >
        <LogOut size={18} />
        Logout
      </button>
    ) : (
      <Link
        href="/login"
        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold text-white shadow-md"
      >
        <LogIn size={18} />
        Login
      </Link>
    )}
  </div>

  {/* Toast Container */}
  {/* <ToastContainer position="top-center" autoClose={1500} theme="colored" /> */}
</header>

  );
}

export default Header;
