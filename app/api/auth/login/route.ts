import { connectToDatabase } from "@/lib/mongodb";
import { verifyPassword, generateToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password, role } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username, role });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const userData = {
      id: user._id.toString(),
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };

    const token = generateToken(user._id.toString(), user.role);

    return NextResponse.json({ user: userData, token }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
