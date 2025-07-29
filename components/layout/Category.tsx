import { deleteCategory } from "@/lib/actions";
import ConfirmDelete from "../features/ConfirmDelete";
import EditButton from "../ui/EditButton";
import { getCategoryById } from "@/lib/data-service";

export default async function Category({
  category,
}: {
  category: CategoryType;
}) {
  let parentName;
  if (category.parent !== null) {
    parentName = await getCategoryById(category.parent._id);
  }

  return (
    <tr className="border border-blue-200 p-1">
      <td>{category.name}</td>
      <td>{parentName?.name}</td>

      <td>
        <EditButton href={`/categories/edit/${category._id}`} />
        <ConfirmDelete
          id={category._id}
          name={category.name}
          deleteAction={deleteCategory}
        />
      </td>
    </tr>
  );
}
