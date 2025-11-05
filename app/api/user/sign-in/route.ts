import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { InvalidSignIn, Ok } from "@/lib/response";

export async function POST(req: Request) {
    const db = await getDb();
    const body = await req.json();
    const user = await db.collection("users").findOne({
        username: body.username
    });
    if (!user) {
        return InvalidSignIn();
    }

    const passwordValid = await bcrypt.compare(body.password, user.password);
    if (!passwordValid) {
        return InvalidSignIn();
    }

    const res = Ok({ id: user._id.toString(), username: user.username });
    res.headers.set("Set-Cookie", `it-takes-two=${user._id.toString()}; Path=/; HttpOnly; SameSite=Lax`);
    return res;
}