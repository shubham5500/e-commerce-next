import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  const { sizeId } = params;
  try {

    if (!sizeId) {
      return new NextResponse("Size Id is required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("SIZE_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  const { storeId, sizeId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { name, value } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    const store = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) {
      return new NextResponse(
        "Unauthorized, Store does not exist for this user.",
        { status: 403 }
      );
    }

    const size = await prismadb.size.updateMany({
      where: {
        id: sizeId,
        storeId,
      },
      data: {
        name,
        value
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("SIZE_PATCH", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  const { sizeId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!sizeId) {
      return new NextResponse("Size Id is required", { status: 400 });
    }

    const size = await prismadb.size.deleteMany({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("SIZE_DELETE", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
