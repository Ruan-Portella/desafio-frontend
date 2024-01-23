import { NextResponse } from "next/server";
import prismadb from "../../../../../lib/prismadb";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const authorization = await req.headers.get("authorization");

    if (!authorization) {
      return new NextResponse("Missing authorization header", { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET);

    const userToken = jwt.decode(token);

    const user = await prismadb.user.findFirst({
      where: {
        id: userToken.id,
      },
    });

    return NextResponse.json('User Verified');
  } catch (error: any) {
    return new NextResponse(error.message, { status: 401 });
  }
}