import Layout from "@/components/layout/Layout";
import ProductForm from "@/components/layout/ProductForm";
import { getCategories } from "@/lib/data-service";

export default async function Page() {
  const categories = await getCategories()
  return (
    <Layout>
      <ProductForm categories={categories}/>
    </Layout>
  );
}
