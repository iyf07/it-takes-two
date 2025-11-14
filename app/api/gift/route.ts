import { getDb } from "@/lib/mongodb";
import { Ok } from "@/lib/response";

export async function POST(req: Request) {
    const body = await req.json();
    const db = await getDb();

    await db.collection("gifts").insertOne({
        receiverId: body.receiverId,
        senderId: body.senderId,
        name: body.name,
        note: body.note,
        price: body.price,
        currency: body.currency,
        date: new Date().toISOString()
    });

    return Ok();
}