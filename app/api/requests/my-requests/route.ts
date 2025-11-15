import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userStr = request.headers.get("x-user");

    if (!userStr) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = JSON.parse(userStr);
    const { db } = await connectToDatabase();
    const requestsCollection = db.collection("service_requests");

    const requests = await requestsCollection
      .find({ customerId: user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error("Fetch requests error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
