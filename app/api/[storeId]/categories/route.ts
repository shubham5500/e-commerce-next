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

    const { name, billboardId } = body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("name is required", { status: 401 });
    }

    if (!billboardId) {
      return new NextResponse("billboard id Url is required", { status: 401 });
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
    const category = await prismadb.category.create({
      data: {
        storeId,
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("POST_ROUTES_CATEGORY", error);
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
    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("POST_ROUTES_BILLBOARDS");
    return new NextResponse("Internal server error", { status: 500 });
  }
}
