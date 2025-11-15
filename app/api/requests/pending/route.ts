import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const requestsCollection = db.collection("service_requests");

    const requests = await requestsCollection
      .find({ status: "pending" })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error("Fetch pending requests error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
