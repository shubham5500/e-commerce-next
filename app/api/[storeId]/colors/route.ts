import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const { storeId } = params;
    const body = await req.json();

    const { name, value } = body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("name is required", { status: 401 });
    }

    if (!value) {
      return new NextResponse("value Url is required", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 401 });
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
    const color = await prismadb.color.create({
      data: {
        storeId,
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("POST_ROUTES_SIZES", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
    
  const { storeId } = params;

  try {
    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 401 });
    }
    const color = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("POST_ROUTES_SIZE");
    return new NextResponse("Internal server error", { status: 500 });
  }
}
