import { getDb } from "@/lib/mongodb";
import { Ok } from "@/lib/response";
import { CURRENCIES } from "@/lib/data/currency";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const db = await getDb();
    const { id } = await params;
    const services = await db.collection("services").find({ userId: id }).toArray();
    const weightMap = Object.fromEntries(
        CURRENCIES.map(c => [c.category, c.weight])
    );
    services.sort((a, b) => {
        const wA = weightMap[a.category] ?? Infinity;
        const wB = weightMap[b.category] ?? Infinity;
        return wA === wB ? a.price - b.price : wA - wB;
    });
    return Ok({ services });
}