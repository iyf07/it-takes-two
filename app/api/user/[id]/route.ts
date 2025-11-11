import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { checkUsernameExists } from "@/lib/server-utils";
import { Ok, UsernameConflict, UserNotFound, InvalidUserID, UnprocessableEntity } from "@/lib/response";
import { CURRENCIES } from "@/lib/data/currency";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const db = await getDb();
    const { id } = await params;
    try {
        const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
        if (!user) {
            return UserNotFound();
        }
        return Ok({ user });
    } catch (error) {
        return InvalidUserID();
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const body = await req.json();
    const db = await getDb();
    const { id } = await params;
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
    const updateFields: Record<string, any> = {};
    if (body.username) {
        if (await checkUsernameExists(body.username)) {
            return UsernameConflict();
        } else {
            updateFields.username = body.username;
        }
    }

    if (body.password) {
        updateFields.password = body.password;
    }

    if (body.partnerId) {
        updateFields.partnerId = body.partnerId;
    }

    if (body.lastCheckedIn) {
        updateFields.lastCheckedIn = body.lastCheckedIn;
    }

    if (body.price && body.currency) {
        const newPrice = Number(user?.[body.currency] ?? 0) + Number(body.price);
        if (newPrice < 0) {
            return UnprocessableEntity();
        }
        updateFields[body.currency] = newPrice;
        if(body.price > 0 && body.exchange === undefined){
            updateFields.xp = Number(user?.xp ?? 0) + Number(body.price) * Number(CURRENCIES.find(c => c.name === body.currency)?.value);
        }
    }
    await db.collection("users").updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
    );
    return Ok();
}
