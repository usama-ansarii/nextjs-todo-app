"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { supabase } from "../../lib/supabaseClient";
import { toast } from "react-toastify";
import Header from "../components/Header";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;
      setUser(currentUser);

      if (!currentUser) {
        console.log("User no Logged In::::");
         toast.error("User not logged in");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      if (!token) {
        console.log("No session token found");

        toast.error("No session token found");
        return;
      }

      try {
        const res = await axios.get("/api/todos", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        console.log("todos:", res.data.todos);
        setTodos(res.data.todos);
         toast.success("Todos loaded successfully!");
      } catch (error) {
        console.error("error::", error);
            toast.error("Failed to fetch todos");
      }
    };
    fetchTodos();
  }, []);

  const handleDelete = async (id) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
 toast.error("You must be logged in to delete a todo");
      return;
    }

    try {
      await axios.delete("/api/todos", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        data: { id },
      });
      setTodos(todos.filter((todo) => todo.id !== id));
      toast.success("Todo deleted successfully!");
    } catch (error) {
      console.error("error :: ", error);
      toast.error("Failed to delete todo");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-12 flex flex-col items-center">
      {/* <Header /> */}
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-3xl border border-white/20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Your Todos</h1>
          <Link
            href="/createtodo"
            className="px-5 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold transition"
          >
            + Add Todo
          </Link>
        </div>

        {todos.length === 0 ? (
          <p className="text-white/70 text-center">
            No todos yet. Create one to get started!
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="bg-white/10 p-5 rounded-xl border border-white/20 flex justify-between items-start hover:bg-white/20 transition"
              >
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {todo.title}
                  </h2>
                  <p className="text-white/70 mt-1">{todo.description}</p>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/createtodo?id=${todo.id}`}
                    className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </Link>

                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
