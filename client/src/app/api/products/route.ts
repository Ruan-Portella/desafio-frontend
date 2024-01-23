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

export async function GET(req: Request, { params }: { params: { productId?: string }}) {
  try {
    const authorization = await req.headers.get("authorization");

    if (!authorization) {
      return new NextResponse("Missing authorization header", { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET);

    if (params?.productId !== undefined) {
      const product = await prismadb.products.findUnique({
        where: {
          id: params.productId
        }
      });

      if (!product) {
        return new NextResponse("Product not found", { status: 404 });
      }

      return NextResponse.json({ product });
    } else {
      const products = await prismadb.products.findMany();
      return NextResponse.json({ products });
    }
  } catch (error: any) {
    return new NextResponse(error.message, { status: 401 });
  }
}

export async function PUT(req: Request, { params }: { params: { productId: string }}) {
  try {
    const { name, price, quantity } = await req.json();
    const id  = params.productId;
    const authorization = await req.headers.get("authorization");

    if (!authorization) {
      return new NextResponse("Missing authorization header", { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET);

    if (!id || !name || !price || !quantity) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const existingProduct = await prismadb.products.findUnique({
      where: {
        id
      }
    })

    if (!existingProduct) {
      return new NextResponse("Product does not exists", { status: 400 });
    }

    const updatedProduct = await prismadb.products.update({
      where: {
        id
      },
      data: {
        name,
        price,
        quantity
      }
    })

    return NextResponse.json({ updatedProduct });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 401 });
  }
}

export async function DELETE(req: Request, { params }: { params: { productId: string }}) {
  try {
    const id = params.productId;
    const authorization = await req.headers.get("authorization");

    if (!authorization) {
      return new NextResponse("Missing authorization header", { status: 401 });
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET);

    if (!id) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const existingProduct = await prismadb.products.findUnique({
      where: {
        id
      }
    })

    if (!existingProduct) {
      return new NextResponse("Client does not exists", { status: 400 });
    }

    const deletedProduct = await prismadb.products.delete({
      where: {
        id
      }
    })

    return NextResponse.json({ deletedProduct });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 401 });
  }
}