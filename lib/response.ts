import { NextResponse } from "next/server";

// export const ok = (data?: unknown, init?: ResponseInit) =>
//   NextResponse.json(data ?? { ok: true }, { status: 200, ...init });

// export const created = (data?: unknown) =>
//   NextResponse.json(data ?? { ok: true }, { status: 201 });

// export const error = (status: number, message: string, extra?: object) =>
//   NextResponse.json({ error: message, ...extra }, { status });

export function UsernameConflict(message = "Username already exists", extra?: object) {
  return NextResponse.json({ error: message, ...extra }, { status: 409 });
}

export function InvalidSignIn(message = "Invalid username or password", extra?: object) {
  return NextResponse.json({ error: message, ...extra }, { status: 400 });
}

export function InvalidUserID(message = "Invalid user ID", extra?: object) {
  return NextResponse.json({ error: message, ...extra }, { status: 400 });
}

export function UserNotFound(message = "User not found", extra?: object) {
  return NextResponse.json({ error: message, ...extra }, { status: 404 });
}

export function Unauthenticated(message = "Unauthenticated", extra?: object) {
  return NextResponse.json({ error: message, ...extra }, { status: 401 });
}

export function UnprocessableEntity(message = "Insufficient funds", extra?: object) {
  return NextResponse.json({ error: message, ...extra }, { status: 422 });
}

export function Ok(extra?: object) {
  return NextResponse.json({ ...extra }, { status: 200 });
}

// export const badRequest = (message = "Bad Request", extra?: object) =>
//   error(400, message, extra);