import ProductForm from "@/components/layout/ProductForm";
import Layout from "@/components/layout/Layout";

import { getProductById } from "@/lib/data-service";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return null;
  return (
    <Layout>
      <ProductForm product={product} />
    </Layout>
  );
}
