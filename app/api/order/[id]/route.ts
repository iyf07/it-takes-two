import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { Ok } from "@/lib/response";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const db = await getDb();
    const { id } = await params;

    await db.collection("orders").updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: true } }
    );

    return Ok();
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const db = await getDb();
    const { id } = await params;

    await db.collection("orders").deleteOne(
        { _id: new ObjectId(id) },
    );

    return Ok();
}