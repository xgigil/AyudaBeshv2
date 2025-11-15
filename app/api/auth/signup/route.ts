import { connectToDatabase } from "@/lib/mongodb";
import { hashPassword, generateToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, fullName, role } = await request.json();

    if (!username || !email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const result = await usersCollection.insertOne({
      username,
      email,
      password: hashedPassword,
      fullName,
      role: role || "customer",
      createdAt: new Date(),
    });

    const user = {
      id: result.insertedId,
      username,
      fullName,
      email,
      role: role || "customer",
    };

    const token = generateToken(result.insertedId.toString(), user.role);

    return NextResponse.json({ user, token }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
