import { getDb } from "@/lib/mongodb";
import { Ok } from "@/lib/response";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const db = await getDb();
    const { id } = await params;
    const services = await db.collection("services").find({ userId: id }).toArray();
    return Ok({ services });
}