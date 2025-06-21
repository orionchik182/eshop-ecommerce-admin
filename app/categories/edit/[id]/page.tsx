import CategoryForm from "@/components/layout/CategoryForm";
import Layout from "@/components/layout/Layout";
import { updateCategory } from "@/lib/actions";
import { getCategories, getCategoryById } from "@/lib/data-service";

export default async function Page({ params }: Props) {
  const { id } = await params;
  const category = await getCategoryById(id);
  const categories = await getCategories();

  return (
    <Layout>
      
      <CategoryForm
        action={updateCategory}
        category={category}
        categories={categories}
      />
    </Layout>
  );
}
