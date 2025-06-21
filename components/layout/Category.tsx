import { deleteCategory } from "@/lib/actions";
import ConfirmDelete from "../features/ConfirmDelete";
import EditButton from "../ui/EditButton";

export default function Category({ category }: { category: CategoryType }) {
  return (
    <tr className="border border-blue-200 p-1">
      <td>{category.name}</td>
      <td>{category.parent?.name}</td>
      
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
