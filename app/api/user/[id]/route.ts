import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { checkUsernameExists } from "@/lib/server-utils";
import { Ok, UsernameConflict, UserNotFound, InvalidUserID } from "@/lib/response";

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

    await db.collection("users").updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
    );
    return Ok();
}
