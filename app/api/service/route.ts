import { getDb } from "@/lib/mongodb";
import { Ok } from "@/lib/response";

export async function POST(req: Request) {
    const body = await req.json();
    const db = await getDb();

    await db.collection("services").insertOne({
        name: body.name,
        category: body.category,
        price: body.price,
        description: body.description,
        userId: body.userId
    });

    return Ok();
}

