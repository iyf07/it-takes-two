import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { Ok } from "@/lib/response";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const db = await getDb();
    const { id } = await params;
    const service = await db.collection("services").findOne({ _id: new ObjectId(id) });
    return Ok({ service });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const body = await req.json();
    const db = await getDb();
    const { id } = await params;

    await db.collection("services").updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                name: body.name,
                price: body.price,
                category: body.category,
                description: body.description
            }
        }
    );

    return Ok();
}