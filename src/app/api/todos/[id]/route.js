import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prsima";

// GET single todo by ID
export async function GET(req, { params }) {
  try {
    const { id } = params;

    // Prisma query
    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ todo }, { status: 200 });
  } catch (error) {
    console.error("GET /api/todos/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT update todo
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { title, description } = body;

    // Validation
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: { title, description },
    });

    return NextResponse.json(
      { message: "Todo updated successfully", todo: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/todos/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
