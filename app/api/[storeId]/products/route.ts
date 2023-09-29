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

    const {
      name,
      price,
      images,
      categoryId,
      sizeId,
      colorId,
      isFeatured,
      isArchived,
    } = body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 401 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 401 });
    }
    if (!categoryId) {
      return new NextResponse("Category is required", { status: 401 });
    }
    if (!sizeId) {
      return new NextResponse("Size is required", { status: 401 });
    }
    if (!colorId) {
      return new NextResponse("Color is required", { status: 401 });
    }
    if (!images || !images.length) {
      return new NextResponse("Upload at least one image", { status: 401 });
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
    const product = await prismadb.product.create({
      data: {
        storeId,
        name,
        price,
        categoryId,
        sizeId,
        colorId,
        isFeatured,
        isArchived,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("POST_ROUTES_PRODUCTS", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId") || undefined;
  const colorId = searchParams.get("colorId") || undefined;
  const sizeId = searchParams.get("sizeId") || undefined;
  const isFeatured = searchParams.get("isFeatured");
  const { storeId } = params;

  try {
    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 401 });
    }
    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("GET_ROUTES_PRODUCTS");
    return new NextResponse("Internal server error", { status: 500 });
  }
}
