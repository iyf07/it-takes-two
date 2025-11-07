import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { Ok } from "@/lib/response";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const body = await req.json();
    const db = await getDb();
    const { id } = await params;

    await db.collection("records").updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: body.status } }
    );

    return Ok();
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const db = await getDb();
    const { id } = await params;

    await db.collection("records").deleteOne(
        { _id: new ObjectId(id) },
    );

    return Ok();
}