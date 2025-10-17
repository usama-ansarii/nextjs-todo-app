"use client";
import { useEffect, useState } from "react";
import { todoSchema } from "@/lib/validation";
import axios from "axios";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Header from "../components/Header";

export default function CreateTodo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParam = useSearchParams();

  const todoId = searchParam?.get("id");
  const isEdit = Boolean(todoId);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const fetchTodo = async () => {
        try {
          const res = await axios.get(`/api/todos/${todoId}`);
          const todo = res?.data?.todo;
          setTitle(todo.title);
          setDescription(todo.description);
        } catch (error) {
          console.error("error:: ", error);
        }
      };
      fetchTodo();
    }
  }, [isEdit, todoId]);

  // Title Validation
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    const result = todoSchema.shape.title.safeParse(value);

    setError((prev) => ({
      ...prev,
      title: result.success ? undefined : result.error.errors?.[0].message,
    }));
  };

  // validation like when we write something in the input  field then the error is remove like yup
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);

    const result = todoSchema.shape.description.safeParse(value);

    setError((prev) => ({
      ...prev,
      description: result.success
        ? undefined
        : result.error.errors?.[0].message,
    }));
  };

  //  Submit Validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = todoSchema.safeParse({ title, description });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setError({
        title: fieldErrors?.title?.[0],
        description: fieldErrors?.description?.[0],
      });
      toast.error("Please fix validation errors!");
      console.log("Validation Errors:", fieldErrors);
      setLoading(false);
      return;
    }

    if (!user) {
      toast.error("Please login first!");
      setLoading(false);
      return;
    }

    try {
      if (isEdit) {
        await axios.put(`/api/todos/${todoId}`, {
          title,
          description,
        });
        toast.success("Todo updated successfully!");
        router.push("/todolist");
      } else {
        const res = await axios.post("/api/todos", {
          title,
          description,
          userId: user.id,
        });
        toast.success("Todo created successfully!");
        console.log("Todo Created:", res.data);
        setError({});
        setTitle("");
        setDescription("");

        await router.push("/todolist");
      }
    } catch (error) {
      console.error("Error :", error);
       toast.error("Something went wrong!");
      NextResponse.json(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Create New Todo
        </h1>
        <p className="text-center text-white/70 mb-8">
          {isEdit
            ? "Update your task details ✏️"
            : "Add your task and stay productive 🚀"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Todo Title"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 
                focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            {error?.title && (
              <p className="text-red-500 text-sm mt-1">{error.title}</p>
            )}
          </div>

          {/* Description Input */}
          <div>
            <textarea
              placeholder="Todo Description"
              value={description}
              onChange={handleDescriptionChange}
              rows="4"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 
                focus:outline-none focus:ring-2 focus:ring-white/40 resize-none"
            />
            {error?.description && (
              <p className="text-red-500 text-sm mt-1">{error.description}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-3 rounded-lg bg-green-500 hover:bg-green-600 
              text-white font-semibold transition-all duration-200"
          >
            {loading ? "Saving..." : isEdit ? "Update Todo" : "Create Todo"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/todolist")}
            className="flex-1 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 
                text-white font-semibold transition-all duration-200"
          >
            See Todo List
          </button>
        </form>
      </div>
    </main>
  );
}
