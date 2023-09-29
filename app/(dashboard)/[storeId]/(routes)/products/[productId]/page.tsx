import prismadb from "@/lib/prismadb";

import ProductForm from "./components/product-form";

type Props = {
  params: {
    productId: string;
    storeId: string;
  };
};

const ProductsPage = async ({ params: { productId, storeId } }: Props) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });
  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
  });
  const colors = await prismadb.color.findMany({
    where: {
      storeId,
    },
  });
  const sizes = await prismadb.size.findMany({
    where: {
      storeId,
    },
  });

  if (!product) {
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
