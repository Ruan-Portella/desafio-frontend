import { NextResponse } from "next/server";
import prismadb from "../../../../lib/prismadb";
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    const { name, price, quantity } = await req.json();
    const authorization = await req.headers.get("authorization");

    if (!authorization) {
      return new NextResponse("Missing authorization header", { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET);

    if (!name || !price || !quantity) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newProduct = await prismadb.products.create({
      data: {
        name,
        price,
        quantity
      }
    })

    return NextResponse.json({ newProduct });
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

    const products = await prismadb.products.findMany();
    return NextResponse.json({ products });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 401 });
  }
}