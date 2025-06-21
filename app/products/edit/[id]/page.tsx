import ProductForm from "@/components/layout/ProductForm";
import Layout from "@/components/layout/Layout";

import { getCategories, getProductById } from "@/lib/data-service";

export default async function Page({ params }: Props) {
  const { id } = await params;
  const product = JSON.parse(JSON.stringify(await getProductById(id)));
  const categories = JSON.parse(JSON.stringify(await getCategories()));

  if (!product) return null;
  return (
    <Layout>
      <ProductForm product={product} categories={categories} />
    </Layout>
  );
}
