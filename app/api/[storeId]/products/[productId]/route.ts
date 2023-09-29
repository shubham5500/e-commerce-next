import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;
  try {
    if (!productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        size: true,
        category: true,
        color: true,
        images: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("PRODUCT_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  const { storeId, productId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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

    await prismadb.product.update({
      where: {
        id: productId,
        storeId,
      },
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
          deleteMany: {},
        },
      },
    });


    const product = await prismadb.product.update({
      where: {
        id: productId,
        storeId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((url: {url: string}) => url)]
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("PRODUCT_PATCH", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }

    const product = await prismadb.product.deleteMany({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("PRODUCT_DELETE", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
