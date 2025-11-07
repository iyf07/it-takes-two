import { getDb } from "@/lib/mongodb";
import { Ok } from "@/lib/response";

export async function POST(req: Request) {
    const body = await req.json();
    const db = await getDb();

    await db.collection("orders").insertOne({
        serviceId: body.serviceId,
        userId: body.userId,
        status: "Pending",
        date: new Date().toISOString()
    });

    return Ok();
}

