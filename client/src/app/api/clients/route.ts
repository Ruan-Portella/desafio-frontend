import { NextResponse } from "next/server";
import prismadb from "../../../../lib/prismadb";
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    const { name, email, cpf } = await req.json();
    const authorization = await req.headers.get("authorization");

    if (!authorization) {
      return new NextResponse("Missing authorization header", { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET);

    if (!name || !email || !cpf) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const existingClientByEmail = await prismadb.clients.findUnique({
      where: {
        email
      }
    })

    const existingClientByCpf = await prismadb.clients.findUnique({
      where: {
        cpf
      }
    })

    if (existingClientByEmail || existingClientByCpf) {
      return new NextResponse("Client already exists", { status: 400 });
    }

    const newClient = await prismadb.clients.create({
      data: {
        name,
        email,
        cpf
      }
    })

    return NextResponse.json({ newClient });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 401 });
  }
}

export async function GET(req: Request) {
  try {
    const authorization = await req.headers.get("authorization");

    if (!authorization) {
      return new NextResponse("Missing authorization header", { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET);


      const clients = await prismadb.clients.findMany();
      return NextResponse.json({ clients });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 401 });
  }
}