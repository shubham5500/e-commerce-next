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

    const { label, imageUrl } = body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("label is required", { status: 401 });
    }

    if (!imageUrl) {
      return new NextResponse("Image Url is required", { status: 401 });
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
    const billboard = await prismadb.billboard.create({
      data: {
        storeId,
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("POST_ROUTES_BILLBOARDS", error);
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
    const billboard = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("POST_ROUTES_BILLBOARDS");
    return new NextResponse("Internal server error", { status: 500 });
  }
}
