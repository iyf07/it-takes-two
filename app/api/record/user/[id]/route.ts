import { getDb } from "@/lib/mongodb";
import { Ok } from "@/lib/response";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const db = await getDb();
    const { id } = await params;
    const records = await db.collection("records").find({ userId: id }).sort({ date: -1 }).toArray();
    return Ok({ records });
}