import { NextResponse } from "next/server";

export async function POST() {
const response = NextResponse.json(
    { success: true, status: 201, data: { user_logged_out: true  } },
    { status: 201 }
  );
  response.cookies.set("access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/"
  });

  return response;
}
