import { Ok, Unauthenticated } from "@/lib/response";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("it-takes-two")?.value;

  if (!userId) {
    return Unauthenticated();
  }
  return Ok({ userId });
}
