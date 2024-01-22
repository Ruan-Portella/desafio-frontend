import { NextResponse } from "next/server";
import prismadb from "../../../../../../lib/prismadb";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const {email, password, name} = await req.json();

  if (!email || !password || !name) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  const existingUser = await prismadb.user.findUnique({
    where: {
      email
    }
  })

  if (existingUser) {
    return new NextResponse("User already exists", { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prismadb.user.create({
    data: {
      email,
      password: passwordHash,
      name
    }
  })

  return NextResponse.json(user);
}