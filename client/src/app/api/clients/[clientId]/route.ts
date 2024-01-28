import { NextResponse } from "next/server";
import prismadb from "../../../../../lib/prismadb";
import jwt from "jsonwebtoken";

export async function GET(req: Request, { params }: { params: { clientId?: string }}) {
  try {
    const authorization = await req.headers.get("authorization");
    
    if (!authorization) {
      return new NextResponse("Missing authorization header", { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET);

    if (params?.clientId !== undefined) {
      const client = await prismadb.clients.findUnique({
        where: {
          id: params.clientId
        }
      });

      if (!client) {
        return new NextResponse("Client not found", { status: 404 });
      }

      return NextResponse.json({ client });
    }
  } catch (error: any) {
    return new NextResponse(error.message, { status: 401 });
  }
}

export async function PUT(req: Request, { params }: { params: { clientId: string }}) {
  try {
    const { name, email, cpf } = await req.json();
    const id  = params.clientId;
    const authorization = await req.headers.get("authorization");

    if (!authorization) {
      return new NextResponse("Missing authorization header", { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET);

    if (!id || !name || !email || !cpf) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const existingClient = await prismadb.clients.findUnique({
      where: {
        id
      }
    })

    if (!existingClient) {
      return new NextResponse("Client does not exists", { status: 400 });
    }

    const updatedClient = await prismadb.clients.update({
      where: {
        id
      },
      data: {
        name,
        email,
        cpf
      }
    })

    return NextResponse.json({ updatedClient });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 401 });
  }
}

export async function DELETE(req: Request, { params }: { params: { clientId: string }}) {
  try {
    const id = params.clientId;
    const authorization = await req.headers.get("authorization");

    if (!authorization) {
      return new NextResponse("Missing authorization header", { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET);

    if (!id) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const existingClient = await prismadb.clients.findUnique({
      where: {
        id
      }
    })

    if (!existingClient) {
      return new NextResponse("Client does not exists", { status: 400 });
    }

    const deletedClient = await prismadb.clients.delete({
      where: {
        id
      }
    })

    return NextResponse.json({ deletedClient });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 401 });
  }
}