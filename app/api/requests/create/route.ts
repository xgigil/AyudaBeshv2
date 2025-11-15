import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { serviceId, status } = await request.json();
    const userStr = request.headers.get("x-user");

    if (!userStr || !serviceId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = JSON.parse(userStr);
    const { db } = await connectToDatabase();
    const requestsCollection = db.collection("service_requests");

    const result = await requestsCollection.insertOne({
      customerId: user.id,
      customerName: user.fullName,
      serviceId,
      serviceName: "Service", // This would normally come from a services collection
      status: status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { id: result.insertedId, message: "Request created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
