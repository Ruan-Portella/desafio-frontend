import { NextResponse } from "next/server";
import prismadb from "../../../../lib/prismadb";
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    const { clientId, productId, quantity } = await req.json();
    const authorization = await req.headers.get("authorization");

    if (!authorization) {
      return new NextResponse("Missing authorization header", { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET);

    if (!clientId || !productId || !quantity) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newOrder = await prismadb.orders.create({
      data: {
        clientId,
        productId,
        quantity
      }
    })

    return NextResponse.json({ newOrder });
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

    const orders = await prismadb.orders.findMany({
      include: {
        client: true,
        product: true
      }
    });
    return NextResponse.json({ orders });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 401 });
  }
}