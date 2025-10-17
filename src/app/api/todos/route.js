import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prsima";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// CREATE
export async function POST(req) {
  try {
    const { title, description, userId } = await req.json();

    if (!title || !userId) {
      return NextResponse.json(
        { error: "Missing title or userId" },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        userId,
      },
    });

    return NextResponse.json(
      { message: "Todo created successfully", todo },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/todos error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

// GET ALL
export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Missing Token" }, { status: 401 });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const todos = await prisma.todo.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { message: "Todos fetched successfully", todos },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/todos error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// UPDATE
export async function PUT(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !token) {
      return NextResponse.json(
        { error: "Invalid or expire token" },
        { status: 401 }
      );
    }

    const { id, title, description } = await req.json();

    if (!id || !title) {
      return NextResponse.json(
        { error: "Missing id or title" },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== user.id) {
      return NextResponse.json(
        { error: "Todo not found or unauthorized" },
        { status: 404 }
      );
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: { title, description },
    });

    return NextResponse.json(
      { message: "Todo updated successfully", updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/todos error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Missing Token" }, { status: 401 });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing todo ID" }, { status: 400 });
    }

    const todo = await prisma.todo.findUnique({ where: { id } });

    if (!todo || todo.userId !== user.id) {
      return NextResponse.json(
        { error: "Todo not found or not authorized" },
        { status: 404 }
      );
    }

    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("error :: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
