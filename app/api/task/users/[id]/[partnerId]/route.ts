import { getDb } from "@/lib/mongodb";
import { Ok } from "@/lib/response";
import { CURRENCIES } from "@/lib/data/currency";

export async function GET(req: Request, { params }: { params: Promise<{ id: string, partnerId: string }> }) {
    const db = await getDb();
    const { id, partnerId } = await params;
    const tasks = await db.collection("tasks").find({
        userIds: {$all: [id, partnerId]}
    }).toArray();
    const weightMap = Object.fromEntries(
        CURRENCIES.map(c => [c.category, c.weight])
    );
    tasks.sort((a, b) => {
        const wA = weightMap[a.category] ?? Infinity;
        const wB = weightMap[b.category] ?? Infinity;
        return wA === wB ? a.price - b.price : wA - wB;
    });
    return Ok({ tasks });
}