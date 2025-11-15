import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const { db } = await connectToDatabase();
    const requestsCollection = db.collection("service_requests");

    const result = await requestsCollection.updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Request updated" }, { status: 200 });
  } catch (error) {
    console.error("Update request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
