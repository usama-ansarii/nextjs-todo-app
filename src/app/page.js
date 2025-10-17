import Link from "next/link"
import Header from "./components/Header"


export default function Home() {

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white px-6">
      <Header />
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl p-10 text-center max-w-md w-full border border-white/20">
        <h1 className="text-4xl font-bold mb-4">My To-Do App</h1>
        <p className="text-white/80 mb-10 text-base">
          Stay organized and get things done easily.ddd
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/todolist "
            className="py-3 rounded-lg bg-white text-indigo-600 font-semibold hover:bg-indigo-50 transition"
          >
            See Todo List
          </Link>

          <Link
            href="/createtodo"
            className="py-3 mt-6 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Add New Todo
          </Link>
        </div>
      </div>
    </main>
  )
}
