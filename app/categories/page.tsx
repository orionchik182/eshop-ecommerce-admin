import Category from "@/components/layout/Category";
import CategoryForm from "@/components/layout/CategoryForm";
import Layout from "@/components/layout/Layout";
import { createCategory } from "@/lib/actions";
import { getCategories } from "@/lib/data-service";

export default async function Page() {
  const categories = await getCategories();
  return (
    <Layout>
      
      <CategoryForm action={createCategory} categories={categories}/>
      <table className="mt-4">
        <thead>
          <tr>
            <td className="bg-blue-100 p-1">Category name</td>
            <td className="bg-blue-100 p-1">Parent category</td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <Category
                key={category._id.toString()}
                category={{ ...category, _id: category._id.toString() }}
              />
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
