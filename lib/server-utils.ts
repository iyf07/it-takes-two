import { getDb } from "@/lib/mongodb";

export async function checkUsernameExists(username: string) {
    const db = await getDb();
    const usernameExists = await db.collection("users").findOne({
        username: username
    });
    return usernameExists;
}