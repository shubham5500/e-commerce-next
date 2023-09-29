import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  const { colorId } = params;
  try {

    if (!colorId) {
      return new NextResponse("color Id is required", { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("color_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  const { storeId, colorId } = params;
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

    const color = await prismadb.color.updateMany({
      where: {
        id: colorId,
        storeId,
      },
      data: {
        name,
        value
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("color_PATCH", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  const { colorId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!colorId) {
      return new NextResponse("color Id is required", { status: 400 });
    }

    const color = await prismadb.color.deleteMany({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("color_DELETE", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
