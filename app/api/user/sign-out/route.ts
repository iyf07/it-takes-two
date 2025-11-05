import { Ok } from "@/lib/response";

export async function POST() {
  const res = Ok();
  res.cookies.set("it-takes-two", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  return res;
}