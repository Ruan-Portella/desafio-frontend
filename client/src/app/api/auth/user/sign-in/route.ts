import { NextResponse } from "next/server";
import prismadb from "../../../../../../lib/prismadb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const {email, password} = await req.json();

  if (!email || !password) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  const existingUser = await prismadb.user.findUnique({
    where: {
      email
    }
  })

  if (!existingUser) {
    return new NextResponse("User already not exists", { status: 400 });
  }

  const passwordValid = await bcrypt.compare(password, existingUser.password);

  if (!passwordValid) {
    return new NextResponse("Invalid password", { status: 400 });
  }

  const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

  return NextResponse.json({ token });
}