import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { checkUsernameExists } from "@/lib/server-utils";
import { Ok, UsernameConflict } from "@/lib/response";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  const db = await getDb();

  if (await checkUsernameExists(body.username)) {
    return UsernameConflict();
  }
  
  const password_hash = await bcrypt.hash(body.password, 10);

  const user = await db.collection("users").insertOne({
    username: body.username,
    password: password_hash
  });
  
  const res = Ok({ id: user.insertedId.toString(), username: body.username });
  res.headers.set("Set-Cookie", `it-takes-two=${user.insertedId.toString()}; Path=/; HttpOnly; SameSite=Lax`);
  return res;
}

