import { NextResponse } from "next/server";
import prismadb from "../../../../../lib/prismadb";
import jwt from 'jsonwebtoken'


export async function GET(req: Request, { params }: { params: { orderId?: string } }) {
  try {
    const authorization = await req.headers.get("authorization");

    if (!authorization) {
      return new NextResponse("Missing authorization header", { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET);

    const order = await prismadb.orders.findUnique({
      include: {
        client: true,
        product: true
      },
      where: {
        id: params.orderId
      }
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 401 });
  }
}

export async function PUT(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const { clientId, productId, quantity } = await req.json();
    const id = params.orderId;
    const authorization = await req.headers.get("authorization");

    if (!authorization) {
      return new NextResponse("Missing authorization header", { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET);

    if (!id || !clientId || !productId || !quantity) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const existingOrder = await prismadb.orders.findUnique({
      where: {
        id
      }
    })

    if (!existingOrder) {
      return new NextResponse("Order does not exists", { status: 400 });
    }

    const updatedOrder = await prismadb.orders.update({
      where: {
        id
      },
      data: {
        clientId,
        productId,
        quantity
      }
    })

    return NextResponse.json({ updatedOrder });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 401 });
  }
}

export async function DELETE(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const id = params.orderId;
    const authorization = await req.headers.get("authorization");

    if (!authorization) {
      return new NextResponse("Missing authorization header", { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET);

    if (!id) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const existingOrder = await prismadb.orders.findUnique({
      where: {
        id
      }
    })

    if (!existingOrder) {
      return new NextResponse("Order does not exists", { status: 400 });
    }

    const deletedOrder = await prismadb.orders.delete({
      where: {
        id
      }
    })

    return NextResponse.json({ deletedOrder });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 401 });
  }
}